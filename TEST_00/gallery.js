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

            if (
                selected.length === 0
            ) {

                alert(
                    "No photos selected"
                );

                return;
            }

            const {
                jsPDF
            } = window.jspdf;

            const pdf =
                new jsPDF(
                    "portrait",
                    "mm",
                    "a4"
                );

            const project =
                document
                    .getElementById(
                        "project-title"
                    )
                    .textContent;

const pageWidth = 210;
const pageHeight = 297;

const leftMargin = 20;
const rightMargin = 5;
const topMargin = 20;
const bottomMargin = 5;

const imgW = 85;
const imgH = 65;

const positions = [

    {x: 20,  y: 35},
    {x: 115, y: 35},

    {x: 20,  y: 145},
    {x: 115, y: 145},

];

const totalPages =
    Math.ceil(
        selected.length / 4
    );

for (
    let i = 0;
    i < selected.length;
    i++
) {

    if (
        i > 0 &&
        i % 4 === 0
    ) {

        pdf.addPage();

    }

    const page =
        Math.floor(
            i / 4
        ) + 1;

    if (
        i % 4 === 0
    ) {

        pdf.setFontSize(
            18
        );

        pdf.text(
            project,
            pageWidth / 2,
            12,
            {
                align:
                    "center"
            }
        );

        pdf.setFontSize(
            9
        );

        pdf.text(
            `Page ${page} of ${totalPages}`,
            pageWidth - 5,
            12,
            {
                align:
                    "right"
            }
        );

    }

    const pos =
        positions[
            i % 4
        ];

    const checkbox =
        selected[i];

    const wrapper =
        checkbox.parentElement;

    const img =
        wrapper.querySelector(
            "img"
        );

    const image =
        new Image();

    image.crossOrigin =
        "anonymous";

    image.src =
        img.src.replace(
            "/thumb/",
            "/full/"
        );

    await new Promise(
        resolve => {

            image.onload =
                resolve;

        }
    );

    const canvas =
        document.createElement(
            "canvas"
        );

    canvas.width =
        image.width;

    canvas.height =
        image.height;

    const ctx =
        canvas.getContext(
            "2d"
        );

    ctx.drawImage(
        image,
        0,
        0
    );

    const dataUrl =
        canvas.toDataURL(
            "image/jpeg",
            0.9
        );

    pdf.addImage(
        dataUrl,
        "JPEG",
        pos.x,
        pos.y,
        imgW,
        imgH
    );

    pdf.rect(
        pos.x,
        pos.y,
        imgW,
        imgH
    );

    const day =
        img.src
            .split("/")
            [1];

    pdf.setFontSize(
        8
    );

    pdf.text(
        day,
        pos.x +
            imgW / 2,
        pos.y +
            imgH +
            5,
        {
            align:
                "center"
        }
    );

    if (
        i % 4 === 3 ||
        i ===
            selected.length -
                1
    ) {

        pdf.setFontSize(
            7
        );

        pdf.text(
            "Generated by Photo Diary",
            pageWidth / 2,
            pageHeight - 3,
            {
                align:
                    "center"
            }
        );

    }

}

const now =
    new Date()
        .toISOString()
        .slice(
            0,
            10
        );

const fileName =
    `${project}_${now}.pdf`;

pdf.save(
    fileName
);
        }
    );