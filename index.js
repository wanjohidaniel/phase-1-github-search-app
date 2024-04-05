const form = document.querySelector('form');
const input = document.querySelector('input');
const searchTypeButton = document.querySelector('#searchTypeButton');
const resultsContainer = document.querySelector('#resultsContainer');

let searchType = 'user'; 

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const searchTerm = input.value;
  if (searchType === 'user') {
    const usersResponse = await fetch(`https://api.github.com/search/users?q=${searchTerm}`);
    const usersData = await usersResponse.json();
    displayUsers(usersData.items);
  } else {
    const reposResponse = await fetch(`https://api.github.com/search/repositories?q=${searchTerm}`);
    const reposData = await reposResponse.json();
    displayRepos(reposData.items);
  }
});

searchTypeButton.addEventListener('click', () => {
  searchType = searchType === 'user' ? 'repo' : 'user';
  searchTypeButton.textContent = searchType === 'user' ? 'Search Users' : 'Search Repositories';
  input.placeholder = `Search ${searchType === 'user' ? 'users' : 'repositories'}...`;
});

function displayUsers(users) {
  resultsContainer.innerHTML = '';
  users.forEach(user => {
    const userElement = document.createElement('div');
    userElement.innerHTML = `
      <img src="${user.avatar_url}" alt="${user.login}" />
      <a href="${user.html_url}" target="_blank">${user.login}</a>
    `;
    userElement.addEventListener('click', async () => {
      const reposResponse = await fetch(user.repos_url);
      const reposData = await reposResponse.json();
      displayRepos(reposData);
    });
    resultsContainer.appendChild(userElement);
  });
}

function displayRepos(repos) {
  resultsContainer.innerHTML = '';
  repos.forEach(repo => {
    const repoElement = document.createElement('div');
    repoElement.innerHTML = `
      <a href="${repo.html_url}" target="_blank">${repo.full_name}</a>
    `;
    resultsContainer.appendChild(repoElement);
  });
}