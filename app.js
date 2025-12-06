const express = require('express');
const app = express();
const port = 3000;

 
app.set('json spaces', 2);

 
app.use(express.json());

 
let books = [];
let orders = [];

 
app.get('/', (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Server API Katalog Buku Berjalan",
        info: "Gunakan endpoint /books atau /orders"
    });
});

 
app.get('/books', (req, res) => {
    const { search } = req.query;
    let result = books;

     
    if (search) {
        result = books.filter(book => 
            book.title.toLowerCase().includes(search.toLowerCase())
        );
    }

    res.status(200).json({
        status: "success",
        total: result.length,
        data: result
    });
});

 
app.post('/books', (req, res) => {
    const { title, author, stock } = req.body;

     
    if (!title || !author || stock === undefined) {
        return res.status(400).json({
            status: "error",
            message: "Gagal: Judul, Penulis, dan Stok wajib diisi!"
        });
    }

     
    if (typeof stock !== 'number' || stock <= 0) {
        return res.status(400).json({
            status: "error",
            message: "Gagal: Stok harus berupa angka dan lebih dari 0"
        });
    }

    const newBook = {
        id: Date.now(),
        title,
        author,
        stock
    };

    books.push(newBook);

     
    res.status(201).json({
        status: "success",
        message: "Buku berhasil ditambahkan",
        data: newBook
    });
});

 
app.put('/books/:id/stock', (req, res) => {
    const bookId = parseInt(req.params.id);
    const { newStock } = req.body;

    const bookIndex = books.findIndex(b => b.id === bookId);

     
    if (bookIndex === -1) {
        return res.status(404).json({
            status: "error",
            message: "Buku tidak ditemukan"
        });
    }

     
    books[bookIndex].stock = newStock;

    res.status(200).json({
        status: "success",
        message: "Stok berhasil diperbarui",
        data: books[bookIndex]
    });
});

 
app.get('/orders', (req, res) => {
    res.status(200).json({
        status: "success",
        total: orders.length,
        data: orders
    });
});

 
app.post('/orders', (req, res) => {
    const { bookId, quantity } = req.body;

    
    if (!bookId || !quantity || quantity <= 0) {
        return res.status(400).json({
            status: "error",
            message: "ID Buku wajib diisi dan Quantity harus lebih dari 0"
        });
    }

    const book = books.find(b => b.id === bookId);
    
    
    if (!book) {
        return res.status(404).json({
            status: "error",
            message: "Buku tidak ditemukan"
        });
    }

    const newOrder = {
        id: Date.now(),
        bookId,
        bookTitle: book.title,
        quantity,
        status: "pending" 
    };

    orders.push(newOrder);

    res.status(201).json({
        status: "success",
        message: "Pesanan dibuat, menunggu konfirmasi",
        data: newOrder
    });
});

 
app.post('/orders/:id/confirm', (req, res) => {
    const orderId = parseInt(req.params.id);
    const orderIndex = orders.findIndex(o => o.id === orderId);

    if (orderIndex === -1) {
        return res.status(404).json({
            status: "error",
            message: "Pesanan tidak ditemukan"
        });
    }

     
    orders[orderIndex].status = "confirmed";

    res.status(200).json({
        status: "success",
        message: "Pesanan berhasil dikonfirmasi",
        data: orders[orderIndex]
    });
});

 
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});