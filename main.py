import tkinter as tk
from tkinter import messagebox, ttk
import mysql.connector
import os
import face_recognition
import cv2
import numpy as np
from datetime import datetime
import csv
# Global variables for database connection
cur, conn = None, None
# Modify connect_database to include face data insertion
def connect_database():
    global cur, conn
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="Never#55"
        )
        cur = conn.cursor()

        # Create and select database
        cur.execute("CREATE DATABASE IF NOT EXISTS attendance_system")
        cur.execute("USE attendance_system")

        # Dynamically create today's attendance table
        today_date = datetime.now().strftime("%Y-%m-%d")
        table_name = f"attendance_{today_date}"

        cur.execute(f"""
            CREATE TABLE IF NOT EXISTS `{table_name}` (
                id INT AUTO_INCREMENT PRIMARY KEY,
                person_name VARCHAR(255),
                status ENUM('Present', 'Absent') NOT NULL,
                time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                UNIQUE(person_name) -- Ensure person_name is unique to allow overrides
            )
        """)
        # Insert face data into the images_table
        print("Inserting face data into the database...")
        insert_faces_into_database("faces")
        # Update the status label
        status_label.config(text="C", font=('chiller', 13, 'italic bold'), bg="green")

    except mysql.connector.Error as err:
        status_label.config(text="D", font=('chiller', 13, 'italic bold'), bg="red")
        print(f"Database connection error: {err}")
        root.destroy()  # Close the application if the database connection fails
        exit()
# Function to insert faces into the database
def insert_faces_into_database(known_faces_dir="faces"):
    """
    Encode the images and insert into the `images_table`
     only if the person is not already in the database.
    """
    try:
        # Ensure the `images_table` exists
        cur.execute("""
            CREATE TABLE IF NOT EXISTS images_table (
                id INT AUTO_INCREMENT PRIMARY KEY,
                person_name VARCHAR(255) UNIQUE,
                encoding LONGBLOB
            )
        """)
        # Process the directory and encode images
        for person_name in os.listdir(known_faces_dir):
            person_dir = os.path.join(known_faces_dir, person_name)
            if os.path.isdir(person_dir):
                # Check if the person already exists in the database
                cur.execute("SELECT person_name FROM images_table WHERE person_name = %s", (person_name,))
                existing_record = cur.fetchone()

                if existing_record:
                    print(f"Data for {person_name} is already in the database. Skipping insertion.")
                    continue

                # Collect all encodings for the person
                person_encodings = []
                for filename in os.listdir(person_dir):
                    filepath = os.path.join(person_dir, filename)
                    if filename.endswith((".jpg", ".png")):
                        image = face_recognition.load_image_file(filepath)
                        encodings = face_recognition.face_encodings(image)
                        if encodings:
                            person_encodings.append(encodings[0])

                # Insert the average encoding into the database
                if person_encodings:
                    average_encoding = np.mean(person_encodings, axis=0)
                    encoding_blob = average_encoding.tobytes()

                    cur.execute("""
                        INSERT INTO images_table (person_name, encoding)
                        VALUES (%s, %s)
                    """, (person_name, encoding_blob))
                    print(f"Inserted encoding for {person_name} into the database.")

        conn.commit()
        print("All face encodings have been processed.")
    except Exception as e:
        print(f"An error occurred while inserting faces into the database: {e}")

# Function to mark attendance
def mark_attendance():
    """
    Perform face recognition using webcam feed and mark attendance based on the `images_table` data.
    """
    if not cur or not conn:
        messagebox.showwarning("Database Error", "Database is not connected!")
        return

    try:
        # Fetch known faces and names from the database
        cur.execute("SELECT person_name, encoding FROM images_table")
        records = cur.fetchall()

        if not records:
            messagebox.showinfo("No Data", "No face data found in the database.")
            return

        # Process fetched records
        known_encodings = []
        known_names = []

        for person_name, encoding_blob in records:
            encoding = np.frombuffer(encoding_blob, dtype=np.float64)
            known_encodings.append(encoding)
            known_names.append(person_name)

        # Initialize attendance dictionary
        attendance = {name: "Absent" for name in known_names}

        # Open webcam
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            messagebox.showerror("Webcam Error", "Could not access the webcam.")
            return

        print("Press 'Esc' to finish attendance.")
        while True:
            ret, frame = cap.read()
            if not ret:
                print("Error: Could not read from the webcam.")
                break

            # Convert the frame to RGB
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

            # Detect and encode faces in the frame
            face_locations = face_recognition.face_locations(rgb_frame)
            face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

            for face_encoding, face_location in zip(face_encodings, face_locations):
                # Compare with known encodings
                matches = face_recognition.compare_faces(known_encodings, face_encoding, tolerance=0.5)
                name = "Unknown"

                if True in matches:
                    match_index = matches.index(True)
                    name = known_names[match_index]
                    attendance[name] = "Present"  # Mark as present

                # Draw a rectangle around the face and label it
                top, right, bottom, left = face_location
                cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
                cv2.putText(frame, name, (left, top - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

            # Display the webcam feed
            cv2.imshow("Webcam - Recognizing Faces", frame)

            # Exit on 'Esc' key
            if cv2.waitKey(1) & 0xFF == 27:
                break

        cap.release()
        cv2.destroyAllWindows()

        # Get today's date for the table name
        today_date = datetime.now().strftime("%Y-%m-%d")
        table_name = f"attendance_{today_date}"

        # Ensure the table exists
        cur.execute(f"""
            CREATE TABLE IF NOT EXISTS `{table_name}` (
                id INT AUTO_INCREMENT PRIMARY KEY,
                person_name VARCHAR(255),
                status ENUM('Present', 'Absent') NOT NULL,
                time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                UNIQUE(person_name)
            )
        """)
        # Insert or update attendance data into the table
        for name, status in attendance.items():
            cur.execute(f"""
                INSERT INTO `{table_name}` (person_name, status)
                VALUES (%s, %s)
                ON DUPLICATE KEY UPDATE status = VALUES(status)
            """, (name, status))

        conn.commit()
        messagebox.showinfo("Attendance", "Attendance has been marked successfully.")
        view_attendance()
        export_to_csv()

    except mysql.connector.Error as err:
        messagebox.showerror("Database Error", f"Failed to mark attendance: {err}")
    except Exception as e:
        messagebox.showerror("Error", f"An error occurred: {e}")
def export_to_csv():
    if not cur or not conn:
        messagebox.showwarning("Database Error", "Database is not connected!")
        return

    try:
        today_date = datetime.now().strftime("%Y-%m-%d")
        table_name = f"attendance_{today_date}"
        cur.execute(f"SELECT * FROM `{table_name}`")
        rows = cur.fetchall()

        if not rows:
            messagebox.showinfo("No Data", f"No attendance data found for {today_date}.")
            return

        with open(f"attendance_{today_date}.csv", "w", newline="") as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(["ID", "Person Name", "Status", "timestamp"])  # Write header row
            writer.writerows(rows)  # Write data rows

        messagebox.showinfo("Export Successful", f"Attendance data exported to attendance_{today_date}.csv")

    except mysql.connector.Error as err:
        messagebox.showerror("Database Error", f"Failed to export data: {err}")
    except Exception as e:
        messagebox.showerror("Error", f"An unexpected error occurred: {e}")


def view_attendance():
    if not cur or not conn:
        messagebox.showwarning("Database Error", "Database is not connected!")
        return

    try:
        # Dynamically construct the table name based on today's date
        today_date = datetime.now().strftime("%Y-%m-%d")
        table_name = f"attendance_{today_date}"

        # Execute the query with the dynamically constructed table name
        cur.execute(f"SELECT * FROM `{table_name}`")
        rows = cur.fetchall()

        # Clear the Treeview
        for row in tree.get_children():
            tree.delete(row)

        # Insert rows into the Treeview
        for row in rows:
            tree.insert("", tk.END, values=row)
    except mysql.connector.Error as err:
        messagebox.showerror("Error", f"Failed to retrieve data: {err}")
    except Exception as e:
        messagebox.showerror("Error", f"An unexpected error occurred: {e}")

# GUI Setup
root = tk.Tk()
root.title("Smart Attendance System")
root.geometry("670x500")

# Status Label (Top-right corner)
status_label = tk.Label(root, text="", font=('chiller', 13, 'italic bold'), width=2, height=1)
status_label.place(x=10, y=10)

# Automatically connect to the database when the application starts

connect_database()

# Buttons
mark_button = tk.Button(root, text="Mark Attendance", command=mark_attendance)
mark_button.grid(row=1, column=2, padx=260, pady=30, sticky="w")

# Treeview for displaying attendance records
columns = ("ID", "Name", "Time", "Status")
tree = ttk.Treeview(root, columns=columns, show="headings", height=15)
tree.grid(row=2, column=0, columnspan=10, padx=10, pady=60)

for col in columns:
    tree.heading(col, text=col)
    tree.column(col, width=160)

# Run the application
root.mainloop()

# Close database connection on exit
if conn:
    conn.close()
