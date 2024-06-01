import face_recognition

faces = []
unk = []


def find_all_faces():
    img = face_recognition.load_image_file(
        "https://www.whitehouse.gov/wp-content/uploads/2021/01/44_barack_obama_family.jpg"
    )
    encodings = face_recognition.face_encodings(img)

    faces.extend(encodings)


def find_one():
    img = face_recognition.load_image_file("./image.png")
    encodings = face_recognition.face_encodings(img)

    unk.append(encodings[0])


find_all_faces()
find_one()

res = face_recognition.compare_faces(faces, unk[0])
print(res)
