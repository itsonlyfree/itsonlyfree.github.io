function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

let page = 1;
let loading = false;
let url = decodeURIComponent(getQueryParameter('url'));
let model_name = 'nyvi-estephan-1';

if (url && url !== 'null') {
    model_name = url.split('/').filter(Boolean).pop();
}


const first = model_name.slice(0, 1);
const second = model_name.slice(1, 2);
const numImages = 1000;

function addLeadingZeros(num, totalLength) {
    return String(num).padStart(totalLength, '0');
}

// Carregar mais
function loadMoreContent() {
    if (loading) return;
    loading = true;
    $("#loader").show();

    for (let i = (page - 1) * 100 + 1; i <= page * 100; i++) {
        if (i > numImages) break;

        let imageUrl = `https://fapello.com/content/${first}/${second}/${model_name}/1000/${model_name}_${addLeadingZeros(i, 4)}.jpg`;
        let imageContainer = `<div class="col-6 col-md-3 mb-3">
                                  <a href="#" class="image-link" data-url="${imageUrl}" data-origin="${imageUrl}">
                                      <div class="rounded" style="background-image: url(${imageUrl}); background-position: center; background-size: cover; height: 200px;"></div>
                                  </a>
                              </div>`;
        $("#image-gallery").append(imageContainer);
    }

    $("#loader").hide();
    page++;
    loading = false;
}

$(document).ready(function() {
    loadMoreContent();

    // Carrega mais imagens ao scroll
    $(window).scroll(function() {
        if ($(window).scrollTop() + $(window).height() >= $(document).height() - 100) {
            loadMoreContent();
        }
    });

    // Altera as informações do modal
    $('#image-gallery').on('click', '.image-link', function (event) {
        event.preventDefault();
        var url = $(this).data('url');
        var origin = $(this).data('origin');

        $('#modalImage').attr('src', 'loader.gif');
        $('#modalSrc').attr('href', url);
        $('#modalOrigin').text('Origem: ' + origin);

        $('#modalImage').attr('src', url);

        $('#imageModal').modal('show');

        $('#imageModalLabel').text(model_name);
    });

    // Compartilhamento
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

    // Favoritar
    function getFavorites() {
        let favorites = localStorage.getItem('onlyfree_favorites');
        return favorites ? JSON.parse(favorites) : [];
    }

    function saveFavorites(favorites) {
        localStorage.setItem('onlyfree_favorites', JSON.stringify(favorites));
    }

    function toggleFavorite(url) {
        let favorites = getFavorites();
        if (favorites.includes(url)) {
            favorites = favorites.filter(fav => fav !== url);
            $('#favoriteIcon').removeClass('fa-solid').addClass('fa-regular');
        } else {
            favorites.push(url);
            $('#favoriteIcon').removeClass('fa-regular').addClass('fa-solid');
        }
        saveFavorites(favorites);
    }

    $('#favoriteIcon').click(function() {
        toggleFavorite($('#modalSrc').attr('href'));
    });

    // Inicializa o ícone de favorito
    $('#imageModal').on('show.bs.modal', function () {
        let favorites = getFavorites();
        let url = $('#modalSrc').attr('href');
        if (favorites.includes(url)) {
            $('#favoriteIcon').removeClass('fa-regular').addClass('fa-solid');
        } else {
            $('#favoriteIcon').removeClass('fa-solid').addClass('fa-regular');
        }
    });

    document.getElementById('search-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const query = document.getElementById('query').value;
        window.location.href = `search.html?query=${encodeURIComponent(query)}`;
    });
});
