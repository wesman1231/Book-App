//Retrieves the book or author the user searches for
document.getElementById("search-button").addEventListener("click", async function()
{
    const input = document.getElementById("book-search");
    const inputValue = input.value;
    const addPlus = inputValue.replaceAll(" ","+");
    const booksContainer = document.getElementById("results-wrapper");
    const loadingWheel = document.querySelector('.loader');
    booksContainer.innerHTML = '';
    
    //Fetches search result data from user searches
        loadingWheel.style.visibility = 'visible';
        try{
            const getResult = await fetch(`https://openlibrary.org/search.json?q=${addPlus}`)
            if(!getResult.ok)
            {
                throw new Error(`HTTP error. Status: ${getResult.status}`)
            }
            const data = await getResult.json();
            console.log(data);
            
            //Iterates through the result data and creates a new book object for each search result. The book object contains the title, the cover key, the author, and the first publication year
            for(let i = 0; i < data.docs.length; i++)
            {
                const book = new Book(data.docs[i].title, data.docs[i].cover_i, data.docs[i].author_name, data.docs[i].first_publish_year, data.docs[i].key);
                if(book.cover === undefined)
                {
                    continue //if there is no cover photo available, skip this iteration
                }

                //Creates a div element for each book object created, an h2 element for the title, an img element with a src set to the cover of the book, and an h3 for the first publication year
                const newBookDiv = document.createElement('div');
                const bookTitle = document.createElement('h2');
                const cover = document.createElement('img');
                cover.className = 'cover';
                const author = document.createElement('h3');
                const titleLink = document.createElement('a');
                const imgLink = document.createElement('a');
                imgLink.className = 'imglink';
                const year = document.createElement('p'); 
                const addToListButton = document.createElement('button');
                addToListButton.className = 'add-to-bookshelf-button'

                //creates the content for the corresponding element
                titleLink.href = `https://openlibrary.org/${book.key}`;
                titleLink.target = "_blank";
                titleLink.textContent = book.title;
                const authorText = document.createTextNode(book.author);
                cover.src = `https://covers.openlibrary.org/b/id/${book.cover}-M.jpg`;
                cover.alt = `${book.title} cover`;
                cover.loading = "lazy";
                imgLink.href = `https://openlibrary.org/${book.key}`;
                imgLink.target = "_blank";
                const yearText = document.createTextNode(`First published in ${book.year}`);
                const addToListButtonText = document.createTextNode('Add to your bookshelf');
                addToListButton.className = "add-to-bookshelf-button";

                //adds the content to the corresponding element
                bookTitle.appendChild(titleLink);
                author.appendChild(authorText);
                imgLink.appendChild(cover);
                year.appendChild(yearText);
                addToListButton.appendChild(addToListButtonText);

                //adds the elements to the div container and adds the div container to the results wrapper
                newBookDiv.appendChild(bookTitle);
                newBookDiv.appendChild(author);
                newBookDiv.appendChild(imgLink);
                newBookDiv.appendChild(year);
                newBookDiv.appendChild(addToListButton);
                booksContainer.appendChild(newBookDiv);

                //add book to bookshelf
                 addToListButton.addEventListener('click', async () => {
                    const response = await fetch ('https://yourreadingcorner.com:3000/api/bookshelf', {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(book)
                    });
                    try{
                        const result = await response.json()
                        if(response.ok)
                        {
                            const dialog = document.querySelector('dialog');
                            dialog.show();
                            setTimeout(() => {
                            dialog.close();
                        }, 3000);
                        }
                        else if(!response.ok)
                        {
                            displayError();
                            setTimeout(deleteDisplayError, 3000);
                        }
                    } catch(error){
                        console.error('HTTP error: ', error);
                    }
                 });
            }
        } catch(error){
                console.error('Error fetching data: ', error);
            } finally{
                loadingWheel.style.visibility = 'hidden';
            }
});

document.addEventListener('keydown', async (event) => {
    const input = document.getElementById("book-search");
    const inputValue = input.value;
    const addPlus = inputValue.replaceAll(" ","+");
    const booksContainer = document.getElementById("results-wrapper");
    const loadingWheel = document.querySelector('.loader');
    booksContainer.innerHTML = '';

    if(event.key === 'Enter')
    {
        loadingWheel.style.visibility = 'visible';
         try{
            const getResult = await fetch(`https://openlibrary.org/search.json?q=${addPlus}`)
            
            if(!getResult.ok)
            {
                throw new Error(`HTTP error. Status: ${getResult.status}`)
            }
            const data = await getResult.json();
            console.log(data);
            
            //Iterates through the result data and creates a new book object for each search result. The book object contains the title, the cover key, the author, and the first publication year
            for(let i = 0; i < data.docs.length; i++)
            {
                const book = new Book(data.docs[i].title, data.docs[i].cover_i, data.docs[i].author_name, data.docs[i].first_publish_year, data.docs[i].key);
                if(book.cover === undefined)
                {
                    continue //if there is no cover photo available, skip this iteration
                }

                //Creates a div element for each book object created, an h2 element for the title, an img element with a src set to the cover of the book, and an h3 for the first publication year
                const newBookDiv = document.createElement('div');
                const bookTitle = document.createElement('h2');
                const cover = document.createElement('img');
                cover.className = 'cover';
                const author = document.createElement('h3');
                const titleLink = document.createElement('a');
                const imgLink = document.createElement('a');
                imgLink.className = 'imglink';
                const year = document.createElement('p'); 
                const addToListButton = document.createElement('button');
                addToListButton.className = 'add-to-bookshelf-button'

                //creates the content for the corresponding element
                titleLink.href = `https://openlibrary.org/${book.key}`;
                titleLink.target = "_blank";
                titleLink.textContent = book.title;
                const authorText = document.createTextNode(book.author);
                cover.src = `https://covers.openlibrary.org/b/id/${book.cover}-M.jpg`;
                cover.alt = `${book.title} cover`;
                cover.loading = "lazy";
                imgLink.href = `https://openlibrary.org/${book.key}`;
                imgLink.target = "_blank";
                const yearText = document.createTextNode(`First published in ${book.year}`);
                const addToListButtonText = document.createTextNode('Add to your bookshelf');
                addToListButton.className = "add-to-bookshelf-button";

                //adds the content to the corresponding element
                bookTitle.appendChild(titleLink);
                author.appendChild(authorText);
                imgLink.appendChild(cover);
                year.appendChild(yearText);
                addToListButton.appendChild(addToListButtonText);

                //adds the elements to the div container and adds the div container to the results wrapper
                newBookDiv.appendChild(bookTitle);
                newBookDiv.appendChild(author);
                newBookDiv.appendChild(imgLink);
                newBookDiv.appendChild(year);
                newBookDiv.appendChild(addToListButton);
                booksContainer.appendChild(newBookDiv);

                //add book to bookshelf
                 addToListButton.addEventListener('click', async () => {
                    const response = await fetch ('https://yourreadingcorner.com:3000/api/bookshelf', {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(book)
                    });
                    try{
                        const result = await response.json()
                        if(response.ok)
                        {
                            const dialog = document.querySelector('dialog');
                            dialog.show();
                            setTimeout(() => {
                            dialog.close();
                        }, 3000);
                        }
                        else if(!response.ok)
                        {
                            displayError();
                            setTimeout(deleteDisplayError, 3000);
                        }
                    } catch(error){
                        console.error('HTTP error: ', error);
                    }
                 });
            }
        } catch(error){
                console.error('Error fetching data: ', error);
            } finally{
                loadingWheel.style.visibility = 'hidden';
            }
    }
});

//Class which defines the book object
class Book
    {
        constructor(title, cover, author, year, key)
        {
            this.title = title;
            this.cover = cover;
            this.author = author;
            this.year = year;
            this.key = key;
        }
    }