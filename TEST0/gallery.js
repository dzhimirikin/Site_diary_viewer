async function loadDiary() {

    const response =
        await fetch("diary.json");

    const data =
        await response.json();

    const gallery =
        document.getElementById("gallery");

    const title =
        document.getElementById("project-title");

    const info =
        document.getElementById("project-info");

    title.textContent =
        data.project.toUpperCase();

    const days =
        Object.keys(data.days)
              .sort();

    let photoCount = 0;

    for (const day of days) {

        photoCount +=
            data.days[day].length;

    }

    const firstDay =
        days[0];

    const lastDay =
        days[days.length - 1];

    info.innerHTML =
        `${firstDay} — ${lastDay}<br>` +
        `${photoCount} photos`;

    days.reverse();

    for (const day of days) {

        const section =
            document.createElement("div");

        section.className =
            "day";

        section.innerHTML =
            `<h2>${day}</h2>`;

        const photos =
            document.createElement("div");

        photos.className =
            "photos";

        for (const file of data.days[day]) {

            const wrapper =
                document.createElement("div");

            wrapper.className =
                "photo-wrapper";

            const checkbox =
                document.createElement("input");

            checkbox.type =
                "checkbox";

            checkbox.className =
                "photo-check";

            checkbox.addEventListener(
                "change",
                updateSelectionCount
            );

            const img =
                document.createElement("img");

            img.src =
                `diary/${day}/thumb/${file}`;

            img.onclick = () => {

                window.open(
                    `diary/${day}/full/${file}`,
                    "_blank"
                );

            };

            wrapper.appendChild(
                checkbox
            );

            wrapper.appendChild(
                img
            );

            photos.appendChild(
                wrapper
            );
        }

        section.appendChild(
            photos
        );

        gallery.appendChild(
            section
        );
    }
}

function updateSelectionCount() {

    const count =
        document.querySelectorAll(
            ".photo-check:checked"
        ).length;

    document.getElementById(
        "selection-info"
    ).textContent =
        `Selected: ${count} photos`;
}

loadDiary();

document
    .getElementById(
        "select-all"
    )
    .addEventListener(
        "click",
        () => {

            document
                .querySelectorAll(
                    ".photo-check"
                )
                .forEach(
                    checkbox => {

                        checkbox.checked =
                            true;

                    }
                );

            updateSelectionCount();
        }
    );

document
    .getElementById(
        "clear-all"
    )
    .addEventListener(
        "click",
        () => {

            document
                .querySelectorAll(
                    ".photo-check"
                )
                .forEach(
                    checkbox => {

                        checkbox.checked =
                            false;

                    }
                );

            updateSelectionCount();
        }
    );

document
    .getElementById(
        "export-pdf"
    )
    .addEventListener(
        "click",
        async () => {

            const selected =
                document.querySelectorAll(
                    ".photo-check:checked"
                );

            alert(
                `PDF: ${selected.length} photos`
            );

        }
    );