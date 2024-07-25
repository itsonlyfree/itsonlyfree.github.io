document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('search-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const query = document.getElementById('query').value;
        window.location.href = `search.html?query=${encodeURIComponent(query)}`;
    });
});