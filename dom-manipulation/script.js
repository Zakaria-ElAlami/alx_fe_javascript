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
    sendQuoteToServer(newQuote);
  } else {
    alert('Please enter both a quote and a category.');
  }
}

// Function to send a new quote to the server using a POST request
async function sendQuoteToServer(quote) {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
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
  } catch (error) {
    console.error('Error sending quote to the server:', error);
  }
}

// Other existing functions (showRandomQuote, createAddQuoteForm, populateCategories, filterQuotes) remain the same

// Function to fetch quotes from the server and update local data
async function fetchQuotesFromServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const serverQuotes = await response.json();

    const formattedQuotes = serverQuotes.map(post => ({
      text: post.title,
      category: "Server"
    }));

    resolveConflicts(formattedQuotes);
  } catch (error) {
    console.error('Error fetching quotes from server:', error);
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

// Initialize the app
loadQuotes();
populateCategories();
filterQuotes();
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
createAddQuoteForm();
setInterval(fetchQuotesFromServer, 300000); // Periodically fetch data from the server every 5 minutes
