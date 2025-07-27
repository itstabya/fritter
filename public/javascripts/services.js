// this file is not used at all (old file from migrating from A3, kept for service purposes)
// Show an object on the screen.
function showObject(obj) {
  const pre = document.getElementById('response');
  const preParent = pre.parentElement;
  pre.innerText = JSON.stringify(obj, null, 4);
  preParent.classList.add('flashing');
  setTimeout(() => preParent.classList.remove('flashing'), 300);
}

// Axios responses have a lot of data. This shows only the most relevant data.
function showResponse(axiosResponse) {
  const fullResponse = axiosResponse.response === undefined
    ? axiosResponse
    : axiosResponse.response;
  const abridgedResponse = {
    data: fullResponse.data,
    status: fullResponse.status,
    statusText: fullResponse.statusText,
  };
  showObject(abridgedResponse);
}

// IT IS UNLIKELY THAT YOU WILL WANT TO EDIT THE CODE ABOVE

// EDIT THE CODE BELOW TO SEND REQUESTS TO YOUR API

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properties 'username' and 'password'
 */

/**
 * You can use axios to make API calls like this:
 * const body = { bar: 'baz' };
 * axios.post('/api/foo', body)
 *   .then(showResponse) // on success (Status Code 200)
 *   .catch(showResponse); // on failure (Other Status Code)
 * See https://github.com/axios/axios for more info
 */

// Hint: do not assume a 1:1 mapping between forms and routes

function followUser(fields) {
  axios.post('/api/users/follow/', fields)
  .then(showResponse)
  .catch(showResponse);
}

function createUser(fields) {
  axios.post('/api/users/', fields)
  .then(showResponse)
  .catch(showResponse);
}

function changeUsername(fields) {
  axios.put('/api/users/change-username', fields)
  .then(showResponse)
  .catch(showResponse);
}

function changePassword(fields) {
  axios.put('/api/users/change-password', fields)
  .then(showResponse)
  .catch(showResponse);
}

function unfollowUser(fields) {
  axios.delete(`/api/users/follow/?user=${fields.username}`, fields)
  .then(showResponse)
  .catch(showResponse);
}

function deleteUser(fields) {
  axios.delete('/api/users/', fields)
  .then(showResponse)
  .catch(showResponse);
}

function getFollowers(fields) {
  axios.get('/api/users/followers', fields)
  .then(showResponse)
  .catch(showResponse);
}

function getFollowing(fields) {
  axios.get('/api/users/following', fields)
  .then(showResponse)
  .catch(showResponse);
}

function signIn(fields) {
  axios.post('/api/users/sign-in', fields)
  .then(showResponse)
  .catch(showResponse);
}

function signOut(fields) {
  axios.post('/api/users/sign-out', fields)
  .then(showResponse)
  .catch(showResponse);
}

function viewAllFreets(fields) {
  axios.get('/api/freets/', fields)
  .then(showResponse)
  .catch(showResponse);
}

function viewFreetsByAuthor(fields) {
  axios.get(`/api/freets/?author=${fields.author}`, fields)
  .then(showResponse)
  .catch(showResponse);
}

function createFreet(fields) {
  axios.post('/api/freets/', fields)
  .then(showResponse)
  .catch(showResponse);
}

function deleteFreet(fields) {
  axios.delete(`/api/freets/?id=${fields.id}`, fields)
  .then(showResponse)
  .catch(showResponse);
}

function editFreet(fields) {
  axios.put('/api/freets/', fields)
  .then(showResponse)
  .catch(showResponse);
}

function refreet(fields) {
  axios.post('/api/freets/refreet', fields)
  .then(showResponse)
  .catch(showResponse);
}

function upvoteFreet(fields) {
  axios.post('/api/freets/upvote/', fields)
  .then(showResponse)
  .catch(showResponse);
}

function removeUpvote(fields) {
  axios.delete(`/api/freets/upvote/?id=${fields.id}`, fields)
  .then(showResponse)
  .catch(showResponse);
}



// IT IS UNLIKELY THAT YOU WILL WANT TO EDIT THE CODE BELOW

// map form (by id) to the function that should be called on submit
const formsAndHandlers = {
  'create-user': createUser,
  'delete-user': deleteUser,
  'get-followers': getFollowers,
  'get-following': getFollowing,
  'change-username': changeUsername,
  'change-password': changePassword,
  'follow-user': followUser,
  'unfollow-user': unfollowUser,
  'sign-in': signIn,
  'sign-out': signOut,
  'view-all-freets': viewAllFreets,
  'view-freets-by-author': viewFreetsByAuthor,
  'create-freet': createFreet,
  'delete-freet': deleteFreet,
  'edit-freet': editFreet,
  'refreet': refreet,
  'upvote-freet': upvoteFreet,
  'remove-upvote': removeUpvote,
};

// attach handlers to forms
function init() {
  Object.entries(formsAndHandlers).forEach(([formID, handler]) => {
    const form = document.getElementById(formID);
    form.onsubmit = (e) => {
      e.preventDefault();
      const data = {};
      (new FormData(form)).forEach((value, key) => {
        data[key] = value;
      });
      handler(data);
      return false; // don't reload page
    };
  });
}

window.onload = init; // attach handlers once DOM is ready
