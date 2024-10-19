const quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", category: "Individuality" }
];

// Function to display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quoteDisplay = document.getElementById('quoteDisplay');
  const selectedQuote = quotes[randomIndex];
  quoteDisplay.innerHTML = `<p>"${selectedQuote.text}"</p><p><em>Category: ${selectedQuote.category}</em></p>`;
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

    // Clear the input fields after adding the quote
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    // Display a success message or the newly added quote
    document.getElementById('quoteDisplay').innerHTML = `<p>New quote added successfully!</p>`;
  } else {
    alert('Please enter both a quote and a category.');
  }
}

// Initialize the app
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
createAddQuoteForm();
