# Face Images Directory

This directory contains subdirectories for each person's face images.

## Structure
```
faces/
├── person_name_1/
│   ├── image1.jpg
│   ├── image2.jpg
│   └── image3.png
├── person_name_2/
│   ├── face1.jpg
│   └── face2.jpg
└── sample_person/
    └── README.txt
```

## Instructions

1. **Create a directory** for each person using their exact name
2. **Add 3-5 clear face images** in JPG or PNG format
3. **Ensure good lighting** and the person is looking at the camera
4. **Restart the face recognition service** after adding new images

## Image Guidelines

- **Resolution:** 200x200 to 1000x1000 pixels
- **Format:** JPG, JPEG, or PNG
- **Quality:** Clear, well-lit, front-facing photos
- **Quantity:** 3-5 images per person for best results

## Example
For a person named "John Doe":
```bash
mkdir "faces/John Doe"
# Add images: john1.jpg, john2.jpg, john3.jpg
```

The face recognition service will automatically process these images and create face encodings in the database.