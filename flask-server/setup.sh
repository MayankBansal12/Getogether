#!/bin/bash

# Navigate to the dlib directory and run setup
git clone -b 'v19.21' --single-branch https://github.com/davisking/dlib.git
cd dlib/ 
python setup.py install --set BUILD_SHARED_LIBS=OFF

# Navigate back to the original directory
cd ..

# Install  the requirements from requirements.txt
pip install -r requirements.txt
