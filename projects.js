const projects = [
    "1111",
    "TEST PROJECT",
    "456",
    "232323"

];

const container =
    document.getElementById(
        "projects"
    );

for (const project of projects) {

    const link =
        document.createElement("a");

    link.href =
        `${project}/`;

    link.textContent =
        project;

    link.style.display =
        "block";

    link.style.margin =
        "20px";

    link.style.fontSize =
        "24px";

    container.appendChild(
        link
    );
}
