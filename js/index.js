const BASE_URL = 'https://jsonplaceholder.typicode.com';

const showSpinner = () => {
   const spinner = document.querySelector('.overlay');
   spinner.style.display = 'block';
}

const hideSpinner = () => {
   const spinner = document.querySelector('.overlay');
   spinner.style.display = 'none';
}

const getUsers = async () => {
   showSpinner();
   try {
      const res = await fetch(`${BASE_URL}/users`, {
         headers: {
            'Content-type': 'application/json'
         }
      });
      const users = await res.json();

      if (users.length) {
         users.forEach(user => usersListToHTML(user));
      }

   } catch (error) {
      console.log(`Error: ${error}. Fetching ${BASE_URL}/users`);
      
   } finally {
      hideSpinner();
   }
}

const updateUser = async (id, name, username, email) => {
   showSpinner();
   
   const res = await fetch(`${BASE_URL}/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
         name: name,
         username: username,
         email: email
      }),
      headers: {
         'Content-type': 'application/json; charset=UTF-8'
      }
   })

   const data = await res.json();

   if (data) {
      updateTableRow(data);
      document.querySelector('.form__overlay').style.display = 'none';
      hideSpinner();
   }
}

const deleteUser = async (id) => {
   document.querySelector('.form__overlay').style.display = 'none';
   showSpinner();
   const res = await fetch(`${BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: {
         'Content-type': 'application/json'
      }
   });

   const data = await res.json();

   if (data) {
      document.getElementById(`user-${id}`).remove();
   }

   hideSpinner();
}

const usersListToHTML = ({ id, name, username, email }) => {
   const tbody = document.querySelector('.tbody');

   tbody.insertAdjacentHTML('beforeend', `
         <tr id="user-${id}">
            <td class="id-field">${id}</td>
            <td class="name-field">${name}</td>
            <td class="username-field">${username}</td>
            <td class="email-field">${email}</td>
            <td class='buttons-field'> <button class="edit-btn">Edit user</button>
            <button class="delete-btn">Delete</button> </td>
         </tr>
      `);
}

window.addEventListener('DOMContentLoaded', async () => {
   await getUsers();

   const tbody = document.querySelector('.tbody');

   tbody.addEventListener('click', (e) => {
      const tr = e.target.closest('tr');
      const userId = tr.querySelector('.id-field').innerText;

      if (e.target.className === 'edit-btn') {
         showEditUserForm(userId);
      }
      if (e.target.className === 'delete-btn') {
         deleteUser(userId);
      }
   });

   document.querySelector('.update').addEventListener('click', onUpdateBtnClick);
   document.querySelector('.cancel').addEventListener('click', onCancelBtnClick)
});

const showEditUserForm = (id) => {
   const form = document.querySelector('.form__overlay');
   form.style.display = 'flex';

   const tr = document.getElementById(`user-${id}`);
   const idInput = document.querySelector('.input-id');
   const nameInput = document.querySelector('.input-name');
   const usernameInput = document.querySelector('.input-username');
   const emailInput = document.querySelector('.input-email');

   idInput.value = id || '';
   nameInput.value = tr.querySelector('.name-field').innerText;
   usernameInput.value = tr.querySelector('.username-field').innerText;
   emailInput.value = tr.querySelector('.email-field').innerText;
}

const onUpdateBtnClick = (e) => {
   e.preventDefault();

   const idInput = document.querySelector('.input-id').value;
   const nameInput = document.querySelector('.input-name').value;
   const usernameInput = document.querySelector('.input-username').value;
   const emailInput = document.querySelector('.input-email').value;

   updateUser(idInput, nameInput, usernameInput, emailInput);
}

const onCancelBtnClick = () => {
   document.querySelector('.form__overlay').style.display = 'none';
}

const updateTableRow = ({ id, name, username, email }) => {
   const tr = document.getElementById(`user-${id}`);
   tr.querySelector('.name-field').innerText = name;
   tr.querySelector('.username-field').innerText = username;
   tr.querySelector('.email-field').innerText = email;
}