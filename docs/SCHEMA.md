User
├── id (UUID/PK)
├── email (unique)
├── password_hash
├── display_name
├── avatar_url
├── created_at
└── updated_at

Book
├── id (UUID/PK)
├── title
├── author
├── format (enum: epub/pdf/txt)
├── file_size
├── uploaded_by (FK -> User.id)
├── created_at
└── updated_at

BookFile  (1-to-1 dengan Book, dipisah biar query list Book tetap ringan)
├── id (UUID/PK)
├── book_id (FK -> Book.id, unique)
├── file_data (base64, TEXT/LONGTEXT)
└── created_at

BookCover  (1-to-1 dengan Book, dipisah juga dengan alasan yang sama)
├── id (UUID/PK)
├── book_id (FK -> Book.id, unique)
├── cover_data (base64, TEXT/LONGTEXT)
└── created_at

UserLibrary  (relasi many-to-many User <-> Book)
├── id (UUID/PK)
├── user_id (FK -> User.id)
├── book_id (FK -> Book.id)
├── added_at
├── is_favorite (boolean, default false)
└── UNIQUE(user_id, book_id)

ReadingProgress
├── id (UUID/PK)
├── user_id (FK -> User.id)
├── book_id (FK -> Book.id)
├── position (CFI/percentage)
├── last_read_at
└── UNIQUE(user_id, book_id)

Bookmark
├── id (UUID/PK)
├── user_id (FK -> User.id)
├── book_id (FK -> Book.id)
├── position
├── note (nullable)
└── created_at

Highlight
├── id (UUID/PK)
├── user_id (FK -> User.id)
├── book_id (FK -> Book.id)
├── selected_text
├── position_start
├── position_end
├── color
├── note (nullable)
└── created_at