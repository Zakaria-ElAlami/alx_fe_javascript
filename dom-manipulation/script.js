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

// Function to add a new quote to the local storage and update the server
function addQuote() {
  const quoteText = document.getElementById('newQuoteText').value.trim();
  const quoteCategory = document.getElementById('newQuoteCategory').value.trim();

  if (quoteText && quoteCategory) {
    const newQuote = { text: quoteText, category: quoteCategory };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    filterQuotes();

    // Clear the input fields
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    // Send the new quote to the server using a POST request
    syncQuotes('POST', newQuote);
  } else {
    alert('Please enter both a quote and a category.');
  }
}

// Function to synchronize quotes with the server using the appropriate method (POST or GET)
async function syncQuotes(method, quote = null) {
  const url = 'https://jsonplaceholder.typicode.com/posts';

  try {
    if (method === 'POST' && quote) {
      // Sending a new quote to the server
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: quote.text,
          body: quote.category,
          userId: 1 // Simulate a user ID for the post
        })
      });

      const responseData = await response.json();
      console.log('Quote successfully sent to the server:', responseData);
    } else if (method === 'GET') {
      // Fetching quotes from the server
      const response = await fetch(url);
      const serverQuotes = await response.json();

      const formattedQuotes = serverQuotes.map(post => ({
        text: post.title,
        category: "Server"
      }));

      resolveConflicts(formattedQuotes);
    }
  } catch (error) {
    console.error(`Error during ${method} request to the server:`, error);
  }
}

// Function to resolve conflicts by merging server data with local data
function resolveConflicts(serverQuotes) {
  const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
  const mergedQuotes = [...serverQuotes, ...localQuotes];

  const uniqueQuotes = Array.from(new Set(mergedQuotes.map(quote => quote.text)))
    .map(text => mergedQuotes.find(quote => quote.text === text));

  quotes = uniqueQuotes;
  saveQuotes();
  populateCategories();
  filterQuotes();
  notifyUserOfUpdate();
}

// Function to notify the user when the data has been updated from the server
function notifyUserOfUpdate() {
  const notification = document.createElement('div');
  notification.id = 'updateNotification';
  notification.textContent = 'Quote data has been updated from the server.';
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 5000);
}

// Function to populate categories in the dropdown filter
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];
  uniqueCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Function to filter quotes based on the selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = '';

  const filteredQuotes = selectedCategory === 'all'
    ? quotes
    : quotes.filter(quote => quote.category === selectedCategory);

  filteredQuotes.forEach(quote => {
    const quoteElement = document.createElement('p');
    quoteElement.textContent = quote.text;
    quoteDisplay.appendChild(quoteElement);
  });
}

// Function to fetch quotes from the server at regular intervals
function startServerSync() {
  setInterval(() => {
    syncQuotes('GET'); // Fetch new quotes from the server periodically
  }, 300000); // Check the server for new data every 5 minutes
}

// Initialize the app
loadQuotes();
populateCategories();
filterQuotes();
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
createAddQuoteForm();
startServerSync(); // Start the periodic sync with the server
