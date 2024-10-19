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
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(selectedQuote));
}

// Function to create the add quote form
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

// Function to populate the category filter dropdown
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  const categories = [...new Set(quotes.map(quote => quote.category))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
  const lastSelectedCategory = localStorage.getItem('selectedCategory');
  if (lastSelectedCategory) {
    categoryFilter.value = lastSelectedCategory;
  }
}

// Function to filter and display quotes based on the selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = '';
  filteredQuotes.forEach(quote => {
    const quoteElement = document.createElement('p');
    quoteElement.innerHTML = `"${quote.text}" <em>(Category: ${quote.category})</em>`;
    quoteDisplay.appendChild(quoteElement);
  });
  localStorage.setItem('selectedCategory', selectedCategory);
}

// Function to add a new quote and update the category filter
function addQuote() {
  const quoteText = document.getElementById('newQuoteText').value.trim();
  const quoteCategory = document.getElementById('newQuoteCategory').value.trim();
  if (quoteText !== "" && quoteCategory !== "") {
    quotes.push({ text: quoteText, category: quoteCategory });
    saveQuotes();
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    populateCategories();
    filterQuotes();
  } else {
    alert('Please enter both a quote and a category.');
  }
}

// Initialize the app
loadQuotes();
populateCategories();
filterQuotes();
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
createAddQuoteForm();

