const baseURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json'; 
const key = 'yzACr134NAdnfiM8SwavFaohDvCvJtxx'; 
let url; 

//SEARCH FORM
const searchTerm = document.querySelector('.search');
const startDate = document.querySelector('.start-date');
const endDate = document.querySelector('.end-date');
const searchForm = document.querySelector('form');
const submitBtn = document.querySelector('.submit');

//RESULTS NAVIGATION
const nextBtn = document.querySelector('.next');
const previousBtn = document.querySelector('.prev');
const nav = document.querySelector('nav');

//RESULTS SECTION
const section = document.querySelector('section');

let pageNumber = 0;

searchForm.addEventListener('submit', fetchResults); 
nextBtn.addEventListener('click', nextPage); 
previousBtn.addEventListener('click', previousPage); 

nav.style.display = "none";

function fetchResults(e){
    e.preventDefault();
    // Assemble the full URL
    url = baseURL + '?api-key=' + key + '&page=' + pageNumber + '&q=' + searchTerm.value; 

    if(startDate.value !== '') {
        console.log(startDate.value)
        url += '&begin_date=' + startDate.value;
    };
  
    if(endDate.value !== '') {
        url += '&end_date=' + endDate.value;
    };

    fetch(url)
        .then(function(result) {
            console.log(result)
            return result.json();
        })
        .then(displayResults);
}

function displayResults (json){
    console.log(json);
    let articles = json.response.docs;
    
    nav.style.display = "block";
    if(articles.length === 10) { nextBtn.style.display = 'block'; }
    else { nextBtn.style.display = 'none'; }

    if( pageNumber > 0 ){ previousBtn.style.display = 'block'; }
    else{ previousBtn.style.display = 'none'; }

    while (section.firstChild) {
        section.removeChild(section.firstChild); 
    }

    if( articles.length === 0 ){
        console.log("No Results");
    } 
    else {
        for(let i = 0; i < articles.length; i++) {
            let article = document.createElement('article');
            let heading = document.createElement('h2');
            let link = document.createElement('a');
            let img = document.createElement('img');
            let para = document.createElement('p');
            let clearfix = document.createElement('div');

            let current = articles[i];
            console.log("Current:", current);

            link.href = current.web_url;
            heading.textContent = current.headline.main;
            
            para.textContent = 'Keywords: '; 

            for(let j = 0; j < current.keywords.length; j++) {
                let span = document.createElement('span');   
                span.textContent += current.keywords[j].value + ' ';   
                para.appendChild(span);
            }

            if(current.multimedia.length > 0) {
                img.src = 'http://www.nytimes.com/' + current.multimedia[0].url;
                img.alt = current.headline.main;
            }

            clearfix.setAttribute('class','clearfix');

            article.setAttribute("class", "dropShadow")

            link.appendChild(heading);
            link.appendChild( document.createElement("hr") );
            link.appendChild(img);
            link.appendChild(para);
            link.appendChild(clearfix);
            article.appendChild(link);
            section.appendChild(article);
        }
    }
}

function nextPage(e){
    pageNumber++;
    fetchResults(e);
    console.log("Page number:", pageNumber);
}
  
function previousPage(e) {
    if(pageNumber > 0) {
        pageNumber--;
    } else {
        return;
    }
    fetchResults(e);
    console.log("Page:", pageNumber);
  
};