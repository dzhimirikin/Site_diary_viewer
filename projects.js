const projects = [
    "66666666666"
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
