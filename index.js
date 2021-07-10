const keywords = [];

let currentKeywords = [];

const keywordsCategories = [
  {
    name: 'Programmation',
    keywords: ['Javascript', 'Promises', 'React', 'Vue JS', 'Angular', 'ES6']
  },
  {
    name: 'Librairie',
    keywords: ['Lecture', 'Livres', 'Conseils librairie', 'Bibliothèque']
  },
  {
    name: 'Jeu vidéo',
    keywords: ['Switch', 'Game Boy', 'Nintendo', 'PS4', 'Gaming', 'DOOM', 'Animal Crossing']
  },
  {
    name: 'Vidéo',
    keywords: ['Streaming', 'Netflix', 'Twitch', 'Influenceur', 'Film']
  }
];

const allKeywords = keywordsCategories.reduce((prevKeywords, category) => [
    ...prevKeywords,
    ...category.keywords
  ], []
);

// If the keyword is present in keywords to take into account and we toggle the checkbox, it means
// the checkbox is now unchecked, so we remove the keyword from keywords to take in account.
// Otherwise, it means that we added a new keyword, or we re-checked a checkbox. So we add the
// keyword in the keywords list to take in account.
const toggleKeyword = (keyword) => {
  if (currentKeywords.includes(keyword)) {
    currentKeywords = currentKeywords.filter((currentKeyword) => currentKeyword !== keyword);
  } else {
    currentKeywords.push(keyword);
  }

  reloadArticles();
};

// The first argument is the keyword's label, what will be visible by the user.
// It needs to handle uppercase, special characters, etc.
// The second argument is the value of the checkbox. To be sure to not have bugs, we generally
// put it in lowercase and without special characters.
const addNewKeyword = (label, keyword) => {
  resetInput();
  console.log("label = ", label);
  console.log("keyword = ", keyword);
  console.log("keywords = ", keywords);
  console.log("currentKeywords = ", currentKeywords);
  if (keyword && keyword.trim().length > 0) {
    if (keywords.includes(keyword)) {
      console.warn("You already added this keyword. Nothing happens.");
      return;
    }
  
    if (!label || !keyword) {
      console.error("It seems you forgot to write the label or keyword in the addNewKeyword function");
      return;
    }
    
    keywords.push(keyword);
    currentKeywords.push(keyword);
    console.log("keywords = ", keywords);
    console.log("currentKeywords = ", currentKeywords);
    
    document.querySelector('.keywordsList').innerHTML += `
      <div>
        <input id="${label}" value="${keyword}" type="checkbox" checked onchange="toggleKeyword(this.value)">
          <label for="${label}">${label}</label>
        </div>
      `;
  
    reloadArticles();
    resetKeywordsUl();
  }
};

// Select only articles that contain at least one of the selected keywords (the currentKeywords).
const selectArticlesToShow = (articles) => {
  let selectedArticles;
  if (currentKeywords.length > 0) {
    selectedArticles = [];
    selectedArticles = articles.filter((article) => article.tags.some(function(tag) {
      return currentKeywords.includes(tag);
    }));
  } else {
    selectedArticles = articles;
  }
  return selectedArticles;
}

// We reload the articles depends of the currentKeywords
const reloadArticles = () => {
  document.querySelector('.articlesList').innerHTML = '';
  
  const articlesToShow = selectArticlesToShow(data.articles);
  articlesToShow.forEach((article) => {
    document.querySelector('.articlesList').innerHTML += `
      <article>
        <h2>${article.titre}</h2>
      </article>
    `;
  });
};

// We empty the content from the <ul> under the text input
const resetKeywordsUl = () => {
  document.querySelector('.inputKeywordsHandle ul').innerHTML = '';
};

// We add a new article. The argument is an object with a title
const addNewArticle = (article) => {
  document.querySelector('.articlesList').innerHTML += `
    <article>
      <h2>${article.titre}</h2>
    </article>
  `;
};

// We empty the text input once the user submits the form
const resetInput = () => {
  document.querySelector("input[type='text']").value = "";
};

// function on the model of https://github.com/tc39/proposal-regex-escaping/blob/main/specInJs.js 
const clean = (S) => {
  // 1. let str be ToString(S).
  // 2. ReturnIfAbrupt(str).
  let str = String(S);
  // 3. Let cpList be a List containing in order the code
  // points as defined in 6.1.4 of str, starting at the first element of str.
  let cpList = Array.from(str[Symbol.iterator]());
  // 4. let cuList be a new List
  let cuList = [];
  // 5. For each code point c in cpList in List order, do:
  for (let c of cpList) {
    // i. If c is not a SyntaxCharacter then do:
    if ("^$\\.*+?()[]{}|".indexOf(c) === -1) {
      // Append c to cuList.
      cuList.push(c);
    }
  }
  //6. Let L be a String whose elements are, in order, the elements of cuList.
  let L = cuList.join("");
  // 7. Return L.
  return L;
};

// Find a keyword containing a part of a word to lowercase and without special characters
const findKeywordByStr = (word) => {
  const cleanedWord = clean(word.toLowerCase());
  //console.log(allKeywords);
  //console.log(cleanedWord);
  const foundKeywords = allKeywords.filter(function(keyword) {
    //console.log(cleanedKeyword(keyword).indexOf(cleanedWord));
    if (cleanedKeyword(keyword).indexOf(cleanedWord) != -1) {
      return keyword;
    }
  });
  let foundKeyword;
  if (foundKeywords.length > 0) {
    foundKeyword = foundKeywords[0];
  }
  //console.log(foundKeyword);
  return foundKeyword;
};

// Find all the words from the same category than a keyword
const findWordsFromTheSameCategory = (keyword) => {
  const foundKeywords = keywordsCategories.reduce(function(prevKeywords, category) {
      if (category.keywords.includes(keyword)) {
        //console.log(category.keywords);
        prevKeywords.push(...category.keywords);
      }
      return prevKeywords;
    }, []
  );
  //console.log(foundKeywords);
  return foundKeywords;
};

// Clean a keyword to lowercase and without special characters
const cleanedKeyword = (keyword) => {
  //console.log(keyword, keyword.toLowerCase(), clean(keyword.toLowerCase()));
  const cleanedKeyword = clean(keyword.toLowerCase());
  return cleanedKeyword;
};

// Show the keyword containing a part of the word inserted
// into the form (starting autocompletion at 3 letters).
// We also show all the words from the same category than this word.
// We show in first the keyword containing a part of the word inserted.
// If a keyword is already in the list of presents hashtags (checkbox list), we don't show it.
const showKeywordsList = (value) => {
  // Starting at 3 letters inserted in the form, we do something
  if (value && value.trim().length >= 3) {
    const keyWordUl = document.querySelector(".inputKeywordsHandle ul");
    resetKeywordsUl();
      
    let keyword = findKeywordByStr(value);
    console.log(keyword);
    if (keyword !== undefined && !keywords.includes(cleanedKeyword(keyword))) {
      // This will allow you to add a new element in the list under the text input
      // On click, we add the keyword, like so:
      console.log(`<li onclick="addNewKeyword('${keyword}', '${cleanedKeyword(keyword)}')">${keyword}</li>`);
      keyWordUl.innerHTML += `<li onclick="addNewKeyword('${keyword}', '${cleanedKeyword(keyword)}')">${keyword}</li>`;
      // We also show all the words from the same category than this word.
      findWordsFromTheSameCategory(keyword).forEach((anotherKeyword) => {
        if (anotherKeyword !== keyword && !keywords.includes(cleanedKeyword(anotherKeyword))) {
	  console.log(`<li onclick="addNewKeyword('${anotherKeyword}', '${cleanedKeyword(anotherKeyword)}')">${anotherKeyword}</li>`);
          keyWordUl.innerHTML += `<li onclick="addNewKeyword('${anotherKeyword}', '${cleanedKeyword(anotherKeyword)}')">${anotherKeyword}</li>`;
        }
      });
    }
  }
};

// Once the DOM (you will se what is it next week) is loaded, we get back our form and
// we prevent the initial behavior of the navigator: reload the page when it's submitted.
// Then we call the function addNewKeyword() with 2 arguments: the label value to show,
// and the checkbox value.
window.addEventListener('DOMContentLoaded', () => {
  const inputElement = document.querySelector('input[type="text"]');

  document.querySelector('.addKeywordsForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const keywordInputValue = inputElement.value;
    addNewKeyword(keywordInputValue, cleanedKeyword(keywordInputValue));
  });

  inputElement.addEventListener('input', (event) => {
    const { value } = event.currentTarget;
    showKeywordsList(value);
  });

  data.articles.forEach((article) => {
    addNewArticle(article);
  });
});
