async function loadComponent(id, file) {
    try {
        const response = await fetch("/partials/" + file);
        if (!response.ok) throw new Error("Erro ao carregar " + file);
        const content = await response.text();
        document.getElementById(id).innerHTML = content;
    } catch (error) {
        document.getElementById(id).innerHTML = "Erro ao carregar componente.";
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadComponent("header", "header.html");
    loadComponent("footer", "footer.html");
});


document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('modalCertificado');
  modal.addEventListener('show.bs.modal', function (event) {
    const button = event.relatedTarget;
    const img = button.getAttribute('data-img');
    const title = button.getAttribute('data-title');
    const desc = button.getAttribute('data-desc');

    modal.querySelector('#modalCertificadoImg').src = img;
    modal.querySelector('#modalCertificadoLabel').textContent = title;
    modal.querySelector('#modalCertificadoDesc').textContent = desc;
  });
});

