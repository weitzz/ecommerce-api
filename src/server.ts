import express from 'express';
import cors from 'cors';


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'))

app.listen(4444, () => {
    console.log('Server is running on port 4444');
});