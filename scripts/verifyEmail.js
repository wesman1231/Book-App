require('dotenv').config();
const verifyButton = document.getElementById("verifyButton");
verifyButton.addEventListener('click', async () => {
    try{
        const response = await fetch(`https://yourreadingcorner.com:${process.env.PORT}/verify`, {
            method: post,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(response)
        });
        if(response.ok){
            window.location.href = `https://yourreadingcorner.com:${process.env.PORT}/`;
        }
    } catch(error){
        console.error('Error verifying email: ', error);
    }
});