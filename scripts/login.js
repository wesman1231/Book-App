const loginButton = document.getElementById('login-button');
const signupButton = document.getElementById('signup-button');
const forgotPasswordButton = document.getElementById('forgot-password-button');

loginButton.addEventListener('click', async () =>{
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loadingWheel = document.querySelector('.loader');
    const loginData = {
        'username': username,
        'password': password
    };
    loadingWheel.style.visibility = 'visible';
    const response = await fetch(`https://yourreadingcorner.com/login`, {
        method: 'post',
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
        credentials: 'include'
    });
    console.log(JSON.stringify(loginData));
    try{
        const result = await response.json();
        if(response.ok)
        {
            window.location.href = `https://yourreadingcorner.com/home`;
        }
        if(!response.ok)
        {
            const wrongInfo = document.getElementById('wrong-info');
            wrongInfo.textContent = result.message;
            wrongInfo.show();
            setTimeout(() => {
                wrongInfo.close();
            }, 3000);
        }
    } catch(error){
        console.error('HTTP error: ', error);
    } finally{
        loadingWheel.style.visibility = 'hidden';
    }
});

document.addEventListener('keydown', async (event) => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loadingWheel = document.querySelector('.loader');

    const loginData = {
        'username': username,
        'password': password
    };
        if(event.key === 'Enter')
        {
            loadingWheel.style.visibility = 'visible';
            const response = await fetch(`https://yourreadingcorner.com/login`, {
            method: 'post',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
    });
    console.log(JSON.stringify(loginData));
    try{
        const result = await response.json();
        if(response.ok)
        {
            window.location.href = `https://yourreadingcorner.com/home`;
        }
        if(!response.ok)
        {
            const wrongInfo = document.getElementById('wrong-info');
            wrongInfo.textContent = result.message;
            wrongInfo.show();
            setTimeout(() => {
                wrongInfo.close();
            }, 3000);
        }
    } catch(error){
        console.error('HTTP error: ', error);
    }finally{
        loadingWheel.style.visibility = 'hidden';
    }
    }
});

signupButton.addEventListener('click', () => {
    window.location.href = `https://yourreadingcorner.com/signup`;
});

forgotPasswordButton.addEventListener('click', () => {
    window.location.href = `https://yourreadingcorner.com/forgot-password`;
});