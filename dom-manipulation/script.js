// Initialize the quotes array
let quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", category: "Individuality" }
];

// Function to load quotes from local storage
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quoteDisplay = document.getElementById('quoteDisplay');
  const selectedQuote = quotes[randomIndex];
  quoteDisplay.innerHTML = `<p>"${selectedQuote.text}"</p><p><em>Category: ${selectedQuote.category}</em></p>`;

  // Save the last viewed quote to session storage
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(selectedQuote));
}

// Function to create and display the form for adding new quotes
function createAddQuoteForm() {
  const formContainer = document.createElement('div');

  const quoteInput = document.createElement('input');
  quoteInput.id = 'newQuoteText';
  quoteInput.type = 'text';
  quoteInput.placeholder = 'Enter a new quote';

  const categoryInput = document.createElement('input');
  categoryInput.id = 'newQuoteCategory';
  categoryInput.type = 'text';
  categoryInput.placeholder = 'Enter quote category';

  const addButton = document.createElement('button');
  addButton.id = 'addQuoteButton';
  addButton.textContent = 'Add Quote';
  addButton.addEventListener('click', addQuote);

  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  document.body.appendChild(formContainer);
}

// Function to add a new quote to the array and update the UI
function addQuote() {
  const quoteText = document.getElementById('newQuoteText').value.trim();
  const quoteCategory = document.getElementById('newQuoteCategory').value.trim();

  if (quoteText !== "" && quoteCategory !== "") {
    quotes.push({ text: quoteText, category: quoteCategory });

    // Save the updated quotes to local storage
    saveQuotes();

    // Clear the input fields after adding the quote
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    // Display a success message or the newly added quote
    document.getElementById('quoteDisplay').innerHTML = `<p>New quote added successfully!</p>`;
  } else {
    alert('Please enter both a quote and a category.');
  }
}

// Function to load the last viewed quote from session storage
function loadLastViewedQuote() {
  const lastQuote = sessionStorage.getItem('lastViewedQuote');
  if (lastQuote) {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const selectedQuote = JSON.parse(lastQuote);
    quoteDisplay.innerHTML = `<p>"${selectedQuote.text}"</p><p><em>Category: ${selectedQuote.category}</em></p>`;
  }
}

// Function to export quotes as a JSON file
function exportQuotesAsJSON() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes) && importedQuotes.every(q => q.text && q.category)) {
        quotes.push(...importedQuotes);
        saveQuotes(); // Save the imported quotes to local storage
        alert('Quotes imported successfully!');
        showRandomQuote(); // Refresh the quote display with a new quote
      } else {
        alert('Invalid JSON format. Please ensure the file contains a valid array of quotes.');
      }
    } catch (error) {
      alert('Error reading JSON file. Please check the file format.');
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Initialize the app
loadQuotes();
loadLastViewedQuote();
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
createAddQuoteForm();
document.getElementById('exportQuotes').addEventListener('click', exportQuotesAsJSON);
