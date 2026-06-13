function drawTitleBlock(
    pdf,
    x0,
    y0
) {

    pdf.setDrawColor(0);
    pdf.setLineWidth(0.2);

    // Общий контур
    pdf.rect(
        x0,
        y0,
        100,
        31
    );

    // Горизонтали
    pdf.line(
        x0,
        y0 + 10,
        x0 + 100,
        y0 + 10
    );

    pdf.line(
        x0,
        y0 + 17,
        x0 + 100,
        y0 + 17
    );

    pdf.line(
        x0,
        y0 + 20.5,
        x0 + 100,
        y0 + 20.5
    );

    pdf.line(
        x0,
        y0 + 24.0,
        x0 + 100,
        y0 + 24.0
    );

    pdf.line(
        x0,
        y0 + 27.5,
        x0 + 100,
        y0 + 27.5
    );

    // Вертикали
    pdf.line(
        x0 + 12.8,
        y0 + 10,
        x0 + 12.8,
        y0 + 31
    );

    pdf.line(
        x0 + 47.2,
        y0 + 10,
        x0 + 47.2,
        y0 + 31
    );

    pdf.line(
        x0 + 65.0,
        y0 + 10,
        x0 + 65.0,
        y0 + 31
    );

    pdf.line(
        x0 + 81.0,
        y0 + 10,
        x0 + 81.0,
        y0 + 31
    );

}

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

            img.dataset.day = day;

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

// Рамка листа
pdf.setLineWidth(0.25);

pdf.rect(
    20,  // X
    5,   // Y
    185, // ширина
    287  // высота
);

drawTitleBlock(
    pdf,
    105,
    261
);

// Размер ячейки фото
const cellW = 85;
const cellH = 65;

// Координаты 2×2
const positions = [

    {x: 25, y: 25},
    {x: 115, y: 25},

    {x: 25, y: 120},
    {x: 115, y: 120},

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

        pdf.setLineWidth(
            0.25
        );

        pdf.rect(
            20,
            5,
            185,
            287
        );

drawTitleBlock(
    pdf,
    105,
    261
);

    }

    const page =
        Math.floor(
            i / 4
        ) + 1;

    // Заголовок страницы
    if (
        i % 4 === 0
    ) {

        pdf.setFontSize(
            16
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
            202,
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
            0.95
        );

    // Сохранение пропорций
    const scale =
        Math.min(
            cellW /
                image.width,
            cellH /
                image.height
        );

    const drawW =
        image.width *
        scale;

    const drawH =
        image.height *
        scale;

    const drawX =
        pos.x +
        (
            cellW -
            drawW
        ) / 2;

    const drawY =
        pos.y +
        (
            cellH -
            drawH
        ) / 2;

// Рамка ячейки
pdf.setDrawColor(180);
pdf.setLineWidth(0.15);

pdf.rect(
    pos.x,
    pos.y,
    cellW,
    cellH
);

// Фото
    pdf.addImage(
        dataUrl,
        "JPEG",
        drawX,
        drawY,
        drawW,
        drawH
    );

// Дата
    const day =
        img.dataset.day;

pdf.setFontSize(
    8
);

pdf.text(
    day,
    pos.x +
        cellW / 2,
    pos.y +
        cellH +
        6,
    {
        align:
            "center"
    }
);

const fileName =
    img.src
        .split("/")
        .pop();

pdf.setFontSize(8);

pdf.text(
    fileName,
    pos.x + cellW / 2,
    pos.y + cellH + 11,
    {
        align: "center"
    }
);

    // Колонтитул
    if (
        i % 4 === 3 ||
        i ===
            selected.length - 1
    ) {

        const now =
            new Date()
                .toISOString()
                .slice(
                    0,
                    10
                );

        pdf.setFontSize(
            8
        );

        pdf.text(
            `Generated by Photo Diary • ${now}`,
            157,
            295
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

pdf.save(
    `${project}_${now}.pdf`
);
        }
    );