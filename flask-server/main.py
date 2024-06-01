from flask import Flask, request, jsonify
from datetime import datetime
import base64
import face_recognition
import numpy as np
import os
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://root:root@localhost:5432/mydb"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


class User(db.Model):
    __tablename__ = "User"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    phone = db.Column(db.String, nullable=False)
    about = db.Column(db.String, nullable=True)
    profilePic = db.Column(db.String, nullable=True)
    PicName = db.Column(db.String, nullable=True)
    FaceEmbeddings = db.Column(db.ARRAY(db.Float), default=[])


class Event(db.Model):
    __tablename__ = "Event"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String, nullable=False)
    desc = db.Column(db.String, nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    hostId = db.Column(db.Integer, db.ForeignKey("User.id"), nullable=False)
    image = db.Column(db.String, default="")
    participants = db.relationship("EventParticipant", back_populates="event")


class EventParticipant(db.Model):
    __tablename__ = "EventParticipant"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    eventId = db.Column(db.Integer, db.ForeignKey("Event.id"), nullable=False)
    userId = db.Column(db.Integer, db.ForeignKey("User.id"), nullable=False)
    role = db.Column(db.String, nullable=False)
    status = db.Column(db.Integer, nullable=False)
    event = db.relationship("Event", back_populates="participants")
    user = db.relationship("User", back_populates="event_participants")


class Photo(db.Model):
    __tablename__ = "Photo"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    eventId = db.Column(db.Integer, db.ForeignKey("Event.id"), nullable=False)
    private = db.Column(db.Boolean, default=False)
    url = db.Column(db.String, nullable=False)
    embeddings = db.Column(db.ARRAY(db.Float), default=[])
    event = db.relationship("Event", back_populates="photos")
    participants = db.relationship("PhotoParticipant", back_populates="photo")


class PhotoParticipant(db.Model):
    __tablename__ = "PhotoParticipant"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    photoId = db.Column(db.Integer, db.ForeignKey("Photo.id"), nullable=False)
    participantId = db.Column(
        db.Integer, db.ForeignKey("EventParticipant.id"), nullable=False
    )
    photo = db.relationship("Photo", back_populates="participants")
    event_participant = db.relationship(
        "EventParticipant", back_populates="photo_participants"
    )


User.event_participants = db.relationship("EventParticipant", back_populates="user")
Event.photos = db.relationship("Photo", back_populates="event")
EventParticipant.photo_participants = db.relationship(
    "PhotoParticipant", back_populates="event_participant"
)


@app.route("/", methods=["GET"])
def root():
    return "Hello, World!"


@app.route("/generate_embeddings", methods=["POST"])
def generate_embeddings():
    data = request.json
    b64Img = data["image"]
    name = data["name"]
    id = data["id"]
    if not b64Img or not name:
        return jsonify({"error": "No image provided"}), 400

    # Get current time
    current_time = datetime.now()
    newName = f"{name}_{current_time.strftime('%m%d%H%M%S%f')}.png"
    try:
        with open(newName, "wb") as imageconv:
            imageconv.write(base64.decodebytes(b64Img.split(",")[1].encode("utf-8")))

        img = face_recognition.load_image_file(newName)
        encodings = np.array(face_recognition.face_encodings(img))

        if len(encodings) == 0:
            return jsonify({"error": "No faces found"}), 400

        user_id = id
        user = User.query.get(user_id)
        if user:
            print("here:\n", user.name, "\n")
            user.FaceEmbeddings = encodings[0].tolist()
            db.session.commit()

        return jsonify({"message": "done"})
    except Exception as e:
        print("\n\n==generate-embs==\n", e, "\n\n")
        return jsonify({"message": "server error"}), 400
    finally:
        if os.path.exists(newName):
            os.remove(newName)
        print("done embedding")


@app.route("/find-faces", methods=["POST"])
def findFaces():
    data = request.json
    event_id = data.get("event_id")
    b64Img = data.get("image")
    name = data.get("name")
    photo_id = data.get("photo_id")
    if not b64Img or not event_id or not photo_id:
        return jsonify({"error": "No image or event ID provided"}), 400

    current_time = datetime.now()
    newName = f"{name}_faces_{current_time.strftime('%m%d%H%M%S%f')}.png"
    # Decode the image
    try:
        with open(newName, "wb") as imageconv:
            imageconv.write(base64.decodebytes(b64Img.split(",")[1].encode("utf-8")))
        print("here0")

        img = face_recognition.load_image_file(newName)
        encodings = face_recognition.face_encodings(img)
        print("here1")

        if not encodings:
            return jsonify({"error": "No faces found"}), 400

        # Get participants for the event
        event = Event.query.filter_by(id=event_id).first()
        if not event:
            return jsonify({"error": "Event not found"}), 404
        # Get the photo
        photo = Photo.query.filter_by(id=photo_id).first()
        if not photo:
            return jsonify({"error": "Photo not found"}), 404

        print("here2")
        participants = event.participants
        print("\n\n==participants==\n", participants, "\n\n")
        # matching_participants = []
        print("here3")

        # Compare embeddings
        for participant in participants:
            user = participant.user
            # user_embeddings = np.array(user.FaceEmbeddings)
            user_embeddings = np.array(user.FaceEmbeddings)
            if len(user_embeddings) > 0:
                match_results = face_recognition.compare_faces(
                    encodings, user_embeddings
                )
                if any(match_results):
                    photo_participant = PhotoParticipant(
                        photoId=photo.id, participantId=participant.id
                    )
                    db.session.add(photo_participant)
                    # matching_participants.append(
                    #     {
                    #         "id": user.id,
                    #         "name": user.name,
                    #         # "email": user.email,
                    #         # "phone": user.phone,
                    #         # "about": user.about,
                    #         # "profilePic": user.profilePic,
                    #         # "PicName": user.PicName,
                    #     }
                    # )
        db.session.commit()
        return jsonify({"message": "done"})
    except Exception as e:
        print("\n\n==generate-embs==\n", e, "\n\n")
        return jsonify({"message": "server error"}), 500
    finally:
        if os.path.exists(newName):
            os.remove(newName)
        print("done embedding")


if __name__ == "__main__":
    app.run(debug=True, port=6969)
