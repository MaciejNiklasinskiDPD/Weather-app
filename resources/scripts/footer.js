(async () => {    
    while(true) {
        setClock();
        console.log('Time updated');
        await delayBySecondAsync();
    }
})();

function setClock(){
    document.getElementById('time').innerHTML = new Date(Date.now()).toLocaleString();
}

function delayBySecondAsync(){
    return new Promise((resolve) => setTimeout(resolve, 1000));
}