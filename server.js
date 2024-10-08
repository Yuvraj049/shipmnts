const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const connectDb = require('./db');
const Company = require('./models/Company');
const path = require('path');
const body=require('body-parser');
const { error } = require('console');
const app = express();
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(body.json());
app.use(express.static('views'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


const storage = multer.memoryStorage();
const upload = multer({ storage });

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/upload', upload.single('file'), (req, res) => {
  console.log(req.body);
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });

  const sheetName = workbook.SheetNames[0];
  const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  console.log("Sheet data:", sheet);
  const validatedData = validateData(sheet);
  if (validatedData.errors.length > 0) {
    return res.status(400).json({ errors: validatedData.errors });
  }
  res.render('review', { data: validatedData.validData });
});

function validateData(sheet) {
  const errors = [];
  const validData = [];

  // Log the headers of the first row
  if (sheet.length > 0) {
    console.log("Headers:", Object.keys(sheet[0]));
  }

  sheet.forEach((row, index) => {
    // Update these keys to match the actual column names in your file
    const companyName = row['Company Name'];
    const contactNumber = row['Contact Number'];
    if (!companyName || !contactNumber) {
      errors.push(`Row ${index + 1} has missing fields.`);
    } else {
      validData.push({
        'Company Name': companyName,
        'Contact Number': contactNumber
      });
    }
  });

  return { errors, validData };
}


app.post('/confirm-upload', async (req, res) => {
  const { data } = req.body;
  console.log(req.body);
  try { 
    for (const row of data) {
      const company = new Company({
        name: row['Company Name'],
        contact: row['Contact Number'],
      });
      await company.save();
    }

    res.status(200).send('Data stored successfully');
  } catch (error) {
    res.status(500).send('Error storing data: ' + error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
