const db = require('../config/db');

exports.addBook = async (req, res) => {
    try {
        const book = req.body;
        const username = req.session.user.username;
        const [userRows] = await db.execute('SELECT userID FROM logininfo WHERE username = ?', [username]);
        if (userRows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userID = userRows[0].userID;

        const cleanAuthor = Array.isArray(book.author) ? book.author.join(', ') : book.author;

        const [bookRows] = await db.execute('SELECT * FROM books WHERE bookKey = ?', [book.key]);
        if (bookRows.length === 0) {
            await db.execute(
                'INSERT INTO books (title, cover_i, author, year, bookKey) VALUES (?, ?, ?, ?, ?)',
                [book.title, book.cover, cleanAuthor, book.year, book.key]
            );
        }

        await db.execute(
            'INSERT INTO userbookshelves (userID, bookKey) VALUES (?, ?)', [userID, book.key]
        );

        res.status(200).json({ message: 'Book added to bookshelf' });

    } catch (error) {
        console.error('Add book error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getBooks = async (req, res) => {
    try {
        const username = req.session.user.username;
        const [userRows] = await db.execute('SELECT userID FROM logininfo WHERE username = ?', [username]);
        if (userRows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userID = userRows[0].userID;

        const [savedBooks] = await db.execute(`
            SELECT books.title, books.cover_i, books.author, books.year, books.bookKey
            FROM books
            JOIN userbookshelves ON books.bookKey = userbookshelves.bookKey
            WHERE userbookshelves.userID = ?
        `, [userID]);

        res.status(200).json(savedBooks);

    } catch (error) {
        console.error('Get books error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

