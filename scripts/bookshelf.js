window.onload = async function() {
    const response = await this.fetch('https://yourreadingcorner.com:3000/api/bookshelf')
    try{
        const result = await response.json();
        console.log(result);
        for(let i = 0; i < result.length; i++)
        {
            //create elements for each book
            const bookshelfWrapper = document.getElementById('bookshelf-wrapper');
            const savedBookDiv = document.createElement('div');
            savedBookDiv.className = 'saved-book-div';
            const bookTitle = document.createElement('h2');
            const status = document.createElement('select');
            status.name = 'status';
            const wantToRead = document.createElement('option');
            const currentlyReading = document.createElement('option');
            const finishedReading = document.createElement('option');
            const cover = document.createElement('img');
            const author = document.createElement('h3');
            const titleLink = document.createElement('a');
            const imgLink = document.createElement('a');
            imgLink.className = 'imglink';
            const year = document.createElement('p');

            //add content to each elemnent
            titleLink.textContent = result[i].title
            wantToRead.value = 'want-to-read';
            wantToRead.textContent = 'want to read';
            currentlyReading.value = 'currently-reading';
            currentlyReading.textContent = 'currently reading';
            finishedReading.value = 'finished-reading';
            finishedReading.textContent = 'finished reading';
            cover.src = `https://covers.openlibrary.org/b/id/${result[i].cover_i}-M.jpg`
            cover.alt = `${result[i].title} cover`;
            author.textContent = result[i].author.replace(/[\[\],"]/g, '');
            year.textContent = result[i].year;

            //set up links
            titleLink.href = `https://openlibrary.org/${result[i].bookKey}`;
            titleLink.target = '_blank';
            imgLink.href = `https://openlibrary.org/${result[i].bookKey}`;
            imgLink.target = '_blank';

            //add elements to page
            status.appendChild(wantToRead);
            status.appendChild(currentlyReading);
            status.appendChild(finishedReading);
            bookTitle.appendChild(titleLink);
            imgLink.appendChild(cover);
            savedBookDiv.appendChild(bookTitle);
            savedBookDiv.appendChild(status);
            savedBookDiv.appendChild(imgLink);
            savedBookDiv.appendChild(author);
            savedBookDiv.appendChild(year);
            bookshelfWrapper.append(savedBookDiv);

            status.addEventListener('change', () => {
                const wantToReadWrapper = this.document.getElementById('bookshelf-wrapper');
                const currentlyReadingWrapper = document.getElementById('currently-reading-wrapper')
                const finishedReadingWrapper = document.getElementById('finished-reading-wrapper')
                
                if(status.value === "want-to-read")
                {
                    wantToReadWrapper.appendChild(savedBookDiv);
                }
                else if(status.value === 'currently-reading')
                {
                    currentlyReadingWrapper.appendChild(savedBookDiv);
                }
                else if(status.value === 'finished-reading')
                {
                    finishedReadingWrapper.appendChild(savedBookDiv);
                }
            });
        }
    } catch(error){
        console.error('HTTP error: ', error);
    }
};





