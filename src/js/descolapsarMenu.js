(function () {
    
    const btn = document.querySelector('button.mobile-menu-button');

    btn.addEventListener('click', () => {
        console.log("Llega a la función");
        document.querySelector('.mobile-menu').classList.toggle('hidden');
    });

})();