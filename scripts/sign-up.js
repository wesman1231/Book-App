const signUpButton = document.getElementById('sign-up-button');
const loadingWheel = document.querySelector('.loader');

signUpButton.addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const username = document.getElementById('create-username').value;
    const password = document.getElementById('create-password').value;
    const signUpData = {
        'email': email,
        'username': username,
        'password': password
    };
    loadingWheel.style.visibility = 'visible';
    try{
        const response = await fetch(`https://yourreadingcorner.com/signup`, {
        method: 'post',
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(signUpData)
    });
        const result = await response.json();
        if(!response.ok)
        {
            if(result.message.includes('Email already exists'))
            {
                const dupEmail = document.getElementById('dup-email')
                dupEmail.show();
                setTimeout(() => {
                    dupEmail.close();
                }, 3000);
            }
            else if(result.message.includes('Username already exists'))
            {
                const dupUsername = document.getElementById('dup-username')
                dupUsername.show();
                setTimeout(() => {
                    dupUsername.close();
                }, 3000);
            }
        }
        else if(response.ok)
        {
            const successful = document.getElementById('successful');
            successful.textContent = "Sign up successful! Check your email to verify your account and log in.";
            successful.show();
            setTimeout(() => {
                successful.close();
                window.location.href = `https://yourreadingcorner.com/`;
            }, 2000);
        }
        console.log(result);
    } catch(error){
        console.error('HTTP error: ', error);
    } finally{
        loadingWheel.style.visibility = 'hidden';
    }
});

document.addEventListener('keydown', async (event) => {
    if(event.key === 'Enter'){
        const email = document.getElementById('email').value;
        const username = document.getElementById('create-username').value;
        const password = document.getElementById('create-password').value;
        const signUpData = {
            'email': email,
            'username': username,
            'password': password
        };
        const response = await fetch(`https://yourreadingcorner.com/signup`, {
            method: 'post',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(signUpData)
        });
        try{
            const result = await response.json();
            if(!response.ok)
            {
                if(result.message.includes('Email already exists'))
                {
                    const dupEmail = document.getElementById('dup-email')
                    dupEmail.show();
                    setTimeout(() => {
                        dupEmail.close();
                    }, 3000);
                }
                else if(result.message.includes('Username already exists'))
                {
                    const dupUsername = document.getElementById('dup-username')
                    dupUsername.show();
                    setTimeout(() => {
                        dupUsername.close();
                    }, 3000);
                }
            }
            else if(response.ok)
            {
                window.location.href = `https://yourreadingcorner.com/`;
            }
            console.log(result);
        } catch(error){
            console.error('HTTP error: ', error);
        }
    }
    

});

