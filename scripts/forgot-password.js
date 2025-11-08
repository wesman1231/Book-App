const submitButton = document.getElementById('send-email');
const loadingWheel = document.querySelector('.loader');
submitButton.addEventListener('click', async () => {
    const email = document.getElementById('enter-email').value;
    loadingWheel.style.visibility = 'visible';
    
    try{
        const response = await fetch(`https://yourreadingcorner.com:${process.env.PORT}/changePasswordRequest`, {
            method: 'post',
            headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email: email})
        });
        const result = await response.json();
        const emailStatus = document.getElementById('email-status');
        emailStatus.textContent = result.message;
        emailStatus.show();
        setTimeout(() => {
                emailStatus.close();
            }, 5000);
    } catch(error){
        console.error('Error sending email: ', error);
    } finally{
        loadingWheel.style.visibility = 'hidden';
    }
});

document.addEventListener('keydown', async(event) => {
    if(event.key === 'Enter'){
            const email = document.getElementById('enter-email').value;
            loadingWheel.style.visibility = 'visible';
            
            try{
                const response = await fetch(`https://yourreadingcorner.com:${process.env.PORT}/changePasswordRequest`, {
                    method: 'post',
                    headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email: email})
                });
                const result = await response.json();
                const emailStatus = document.getElementById('email-status');
                emailStatus.textContent = result.message;
                emailStatus.show();
                setTimeout(() => {
                        emailStatus.close();
                    }, 5000);
            } catch(error){
                console.error('Error sending email: ', error);
            } finally{
                loadingWheel.style.visibility = 'hidden';
            }
        }
});