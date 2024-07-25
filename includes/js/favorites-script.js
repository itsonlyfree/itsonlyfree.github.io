document.addEventListener('DOMContentLoaded', function() {
    function getFavorites() {
        let favorites = localStorage.getItem('onlyfree_favorites');
        return favorites ? JSON.parse(favorites) : [];
    }

    function loadFavorites() {
        const favorites = getFavorites();
        const gallery = document.getElementById('favorites-gallery');
        gallery.innerHTML = ''; // Clear any existing content

        if (favorites.length === 0) {
            gallery.innerHTML = '<p class="text-center">Nenhuma imagem favorita encontrada.</p><p>Favorite uma imagem clicando no ícone <i class="fa-regular fa-heart mr-3 text-black"></i></p>';
            return;
        }

        document.getElementById('loader').style.display = 'block';

        favorites.forEach((url) => {
            const imageContainer = `
                <div class="col-6 col-md-3 mb-3">
                    <a href="#" class="image-link" data-url="${url}" data-origin="${url}">
                        <div class="rounded" style="background-image: url(${url}); background-position: center; background-size: cover; height: 200px;"></div>
                    </a>
                </div>`;
            gallery.insertAdjacentHTML('beforeend', imageContainer);
        });

        document.getElementById('loader').style.display = 'none';
    }

    document.getElementById('favorites-gallery').addEventListener('click', function(event) {
        if (event.target.closest('.image-link')) {
            event.preventDefault();
            const link = event.target.closest('.image-link');
            const url = link.getAttribute('data-url');
            const origin = link.getAttribute('data-origin');

            document.getElementById('modalImage').src = 'loader.gif';
            document.getElementById('modalSrc').href = url;
            document.getElementById('modalImage').src = url;

            $('#imageModal').modal('show');
        }
    });

    document.getElementById('shareLink').addEventListener('click', function() {
        if (navigator.share) {
            navigator.share({
                title: document.title,
                text: 'Confira esta imagem!',
                url: document.getElementById('modalSrc').href
            }).then(() => {
                console.log('Compartilhamento bem-sucedido');
            }).catch((error) => {
                console.log('Erro ao compartilhar:', error);
            });
        } else {
            alert('O compartilhamento não é suportado neste navegador.');
        }
    });

    function toggleFavorite(url) {
        let favorites = getFavorites();
        if (favorites.includes(url)) {
            favorites = favorites.filter(fav => fav !== url);
            document.getElementById('favoriteIcon').classList.remove('fa-solid');
            document.getElementById('favoriteIcon').classList.add('fa-regular');
        } else {
            favorites.push(url);
            document.getElementById('favoriteIcon').classList.remove('fa-regular');
            document.getElementById('favoriteIcon').classList.add('fa-solid');
        }
        localStorage.setItem('onlyfree_favorites', JSON.stringify(favorites));
    }

    document.getElementById('favoriteIcon').addEventListener('click', function() {
        toggleFavorite(document.getElementById('modalSrc').href);
    });

    $('#imageModal').on('show.bs.modal', function() {
        const favorites = getFavorites();
        const url = document.getElementById('modalSrc').href;
        if (favorites.includes(url)) {
            document.getElementById('favoriteIcon').classList.remove('fa-regular');
            document.getElementById('favoriteIcon').classList.add('fa-solid');
        } else {
            document.getElementById('favoriteIcon').classList.remove('fa-solid');
            document.getElementById('favoriteIcon').classList.add('fa-regular');
        }
    });

    loadFavorites();
});
