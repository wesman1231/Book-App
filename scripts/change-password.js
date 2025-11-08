const changePasswordButton = document.getElementById('change-password-button');
const passwordStatus = document.getElementById('password-status');
changePasswordButton.addEventListener('click', async () => {
    const changePassword = document.getElementById('change-password').value;
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
        console.error('Missing token in URL');
        alert('Invalid or expired reset link.');
        return;
    }

   try{
        const response = await fetch(`https://yourreadingcorner.com/changePassword?token=${token}`, {
        method: 'post',
        headers:{
             'Content-Type': 'application/json',
        },
        body: JSON.stringify({password: changePassword})
        });
        const result = await response.json();
        passwordStatus.textContent = `${result.message}, recirecting to login...`
        passwordStatus.show();
        setTimeout(() => {
                passwordStatus.close();
                window.location.href=`https://yourreadingcorner.com/`
            }, 2000);
        console.log('Password Changed');
   } catch(error){
    console.error('Error changing password: ', error);
   }
});

document.addEventListener('keydown', async (event) => {
    if(event.key === 'Enter'){
        const changePassword = document.getElementById('change-password').value;
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (!token) {
            console.error('Missing token in URL');
            alert('Invalid or expired reset link.');
            return;
        }

        try{
            const response = await fetch(`https://yourreadingcorner.com/changePassword?token=${token}`, {
            method: 'post',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({password: changePassword})
            });
            const result = await response.json();
            passwordStatus.textContent = `${result.message}, recirecting to login...`
            passwordStatus.show();
            setTimeout(() => {
                    passwordStatus.close();
                    window.location.href=`https://yourreadingcorner.com/`
                }, 2000);
            console.log('Password Changed');
        } catch(error){
            console.error('Error changing password: ', error);
        }
    }
});