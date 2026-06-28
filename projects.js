let allProjects = [];

const search =
    document.getElementById(
        "search"
    );

const list =
    document.getElementById(
        "projects"
    );

const openButton =
    document.getElementById(
        "openProject"
    );

async function loadProjects() {

    const response =
        await fetch(
            "index.json"
        );

    const data =
        await response.json();

    allProjects =
        data.projects.sort();

    fillProjects(
        allProjects
    );

}

function fillProjects(
    projects
) {

    list.innerHTML = "";

    for (const project of projects) {

        const option =
            document.createElement(
                "option"
            );

        option.value =
            project;

        option.textContent =
            project;

        list.appendChild(
            option
        );

    }

}

search.addEventListener(
    "input",

    () => {

        const text =
            search.value
                .toLowerCase();

        const filtered =
            allProjects.filter(

                p =>
                    p
                        .toLowerCase()
                        .includes(
                            text
                        )

            );

        fillProjects(
            filtered
        );

    }

);

openButton.addEventListener(

    "click",

    () => {

        if (
            !list.value
        ) {
            return;
        }

        window.location =
            `${list.value}/`;

    }

);

loadProjects();