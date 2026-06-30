function drawTitleBlock(
    pdf,
    x0,
    y0
) {

    const s = loadPdfSettings();

    pdf.setDrawColor(0);
    pdf.setLineWidth(0.2);

    // Общий контур
    pdf.rect(
        x0,
        y0,
        100,
        31
    );

if (companyLogo) {

    try {

        pdf.addImage(
            companyLogo,
            "PNG",

            x0 + 2,
            y0 + 1,

            35,
            8
        );

    } catch (e) {

        console.log(
            "Logo error:",
            e
        );

    }

}


applyPdfFont(
    pdf
);

pdf.setFontSize(
    s.stampSize
);

pdf.setCharSpace(
    s.stampCharSpace
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

// Object
pdf.text(
    "Object:",
    x0 + 1,
    y0 + 13
);

pdf.text(
    projectInfo.object || "",
    x0 + 14,
    y0 + 13
);

// Client
pdf.text(
    "Client",
    x0 + 1,
    y0 + 19
);

pdf.text(
    projectInfo.client || "",
    x0 + 14,
    y0 + 19
);

// Project manager
pdf.text(
    "Proj. manager",
    x0 + 48,
    y0 + 19
);

pdf.text(
    projectInfo.projectManager || "",
    x0 + 66,
    y0 + 19
);

// Head designer
pdf.text(
    "Head designer",
    x0 + 48,
    y0 + 22.5
);

pdf.text(
    projectInfo.headDesigner || "",
    x0 + 66,
    y0 + 22.5
);

// Reviewed by
pdf.text(
    "Reviewed by",
    x0 + 48,
    y0 + 26
);

pdf.text(
    projectInfo.reviewedBy || "",
    x0 + 66,
    y0 + 26
);

// Designer
pdf.text(
    "Designer",
    x0 + 48,
    y0 + 29.5
);

pdf.text(
    projectInfo.designer1 || "",
    x0 + 66,
    y0 + 29.5
);

// Drawing
pdf.text(
    "Drawing:",
    x0 + 1,
    y0 + 29.5
);

pdf.text(
    projectInfo.name || "",
    x0 + 14,
    y0 + 29.5
);

// Scale
pdf.text(
    "Scale:",
    x0 + 82,
    y0 + 29.5
);

pdf.text(
    projectInfo.scale || "",
    x0 + 92,
    y0 + 29.5
);

pdf.setCharSpace(
    0
);

}


let companyLogo = null;

let siteDiaryLogo = null;

let projectInfo = {};

let isAdmin = false;


let currentMode = "view";

const ADMIN_PASSWORD = "0000";
const LAYOUT_PASSWORD = "1111";


let currentPhotos = [];

let currentIndex = 0;




function loadPdfSettings() {

    return {

        textSize:
            parseFloat(
                localStorage.getItem(
                    "pdf-text-size"
                ) || 8
            ),

        commentLines:
            parseInt(
                localStorage.getItem(
                    "pdf-comment-lines"
                ) || 55
            ),

        stampSize:
            parseFloat(
                localStorage.getItem(
                    "pdf-stamp-size"
                ) || 6
            ),

        stampCharSpace:
            parseFloat(
                localStorage.getItem(
                    "pdf-stamp-charspace"
                ) || -0.15
            ),

        drawFrame:
            localStorage.getItem(
                "pdf-draw-frame"
            ) !== "false",

drawTitleBlock:
    localStorage.getItem(
        "pdf-draw-title-block"
    ) !== "false",

drawLogo:
    localStorage.getItem(
        "pdf-draw-logo"
    ) !== "false"
    };
}


function applyGalleryScale() {

//--------------------------------------------------
// Количество фотографий в строке
//--------------------------------------------------

const slider =

    document.getElementById(
        "gallery-scale"
    );

const sliderValue =

    parseInt(

        localStorage.getItem(
            "gallery-density"
        )

    ) || 5;


const density =

    10 - sliderValue;


    //--------------------------------------------------
    // Контейнер галереи
    //--------------------------------------------------

    const gallery =

        document.getElementById(
            "gallery"
        );

    if (!gallery)
        return;


    //--------------------------------------------------
    // Ширина контейнера
    //--------------------------------------------------

    const containerWidth =
        gallery.clientWidth;


    //--------------------------------------------------
    // Расстояние между карточками
    //--------------------------------------------------

    const photos =

        gallery.querySelector(
            ".photos"
        );

    const gap =

        photos

            ? parseInt(
                getComputedStyle(
                    photos
                ).gap
              ) || 12

            : 12;


    //--------------------------------------------------
    // Вычисляем ширину карточки
    //--------------------------------------------------

    const photoWidth =

        Math.floor(

            (
                containerWidth -
                gap * (density - 1)
            )

            / density

        );


    //--------------------------------------------------
    // CSS-переменные
    //--------------------------------------------------

    document.documentElement.style.setProperty(

        "--photo-width",

        photoWidth + "px"

    );


    document.documentElement.style.setProperty(

        "--photo-height",

        Math.round(
            photoWidth * 0.72
        ) + "px"

    );


//--------------------------------------------------
// Обновляем ползунок
//--------------------------------------------------

if (slider) {

    slider.value =

        10 - density;

}


    //--------------------------------------------------
    // Обновляем подпись
    //--------------------------------------------------

    const text =

        document.getElementById(
            "gallery-scale-text"
        );

    if (text)

        text.textContent =
            density +
            " photos per row";

}


function savePdfSettings() {

    localStorage.setItem(
        "pdf-text-size",
        document.getElementById(
            "pdf-text-size"
        ).value
    );

    localStorage.setItem(
        "pdf-comment-lines",
        document.getElementById(
            "pdf-comment-lines"
        ).value
    );

    localStorage.setItem(
        "pdf-stamp-size",
        document.getElementById(
            "pdf-stamp-size"
        ).value
    );

    localStorage.setItem(
        "pdf-stamp-charspace",
        document.getElementById(
            "pdf-stamp-charspace"
        ).value
    );

    localStorage.setItem(
        "pdf-draw-frame",
        document.getElementById(
            "pdf-draw-frame"
        ).checked
    );

    localStorage.setItem(
        "pdf-draw-title-block",
        document.getElementById(
            "pdf-draw-title-block"
        ).checked
    );

    localStorage.setItem(
        "pdf-draw-logo",
        document.getElementById(
            "pdf-draw-logo"
        ).checked
    );
}


function applyPdfFont(
    pdf
) {

    pdf.setFont(
        "isocpeur",
        "normal"
    );
}


async function loadPhotoData(
    project,
    file
) {

const documentId =
    file.replaceAll(
        "/",
        "_"
    );

const ref =
    window.firebaseApi.doc(
        window.firebaseApi.db,
        "projects",
        project,
        "photos",
        documentId
    );

const snap =
    await window.firebaseApi.getDoc(
        ref
    );

    if (
        snap.exists()
    ) {

        return snap.data();

    }

    return null;
}

async function savePhotoData(
    project,
    file,
    data
) {

const documentId =
    file.replaceAll(
        "/",
        "_"
    );

    const ref =
        window.firebaseApi.doc(
            window.firebaseApi.db,
            "projects",
            project,
            "photos",
            documentId
        );

    await window.firebaseApi.setDoc(
        ref,
{
    photoId:
        file,

    comment:
        "",

    attributes: {

        contractorId: 0,

        facadeId: 0,

        floorId: 0,

        zoneId: 0,

        elementId: 0,

        operationId: 0

    },

    ...data,

    updatedAt:
        window.firebaseApi
            .serverTimestamp()
},
        {
            merge: true
        }
    );

}


async function loadAbout() {

    const response =
        await fetch(
            "../about.html"
        );

    const html =
        await response.text();

    document
        .getElementById(
            "about-page"
        )
        .innerHTML =
        html;
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

for (const photo of data.days[day]) {

    const photoId =
        photo.photoId;

    const file =
        photo.fileName;

    const comment = "";

            const project =
                data.project;

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

    const allPhotos = [];

    for (
        const d of days
    ) {

for (
    const p of data.days[d]
) {

    allPhotos.push(

        `diary/${d}/full/${p.fileName}`

    );

}

    }

    const currentPhoto =
        `diary/${day}/full/${file}`;

    const index =
        allPhotos.indexOf(
            currentPhoto
        );

    openViewer(
        allPhotos,
        index
    );

};

            wrapper.appendChild(
                checkbox
            );

            wrapper.appendChild(
                img
            );

            const textarea =
                document.createElement(
                    "textarea"
                );

            textarea.className =
                "photo-comment";

            textarea.rows = 3;

            textarea.placeholder =
                "Comment...";

textarea.value =
    comment;

loadPhotoData(
    project,
    photoId
).then(
    cloud => {

        if (
            cloud
        ) {

            textarea.value =
                cloud.comment || "";

        }

    }
);

textarea.readOnly =
    !isAdmin;

textarea.style.display =
    isAdmin
        ? "block"
        : "none";

textarea.dataset.day =
    day;

textarea.dataset.file =
    photoId;

console.log(
    "ADD BLUR:",
    file
);

textarea.addEventListener(
    "blur",
    () => {

        console.log(
            "BLUR:",
            file
        );

    }
);

textarea.addEventListener(
    "blur",
    async () => {

        console.log(
            "BLUR SAVE:",
            textarea.dataset.file,
            textarea.value
        );

        const project =
            document
                .getElementById(
                    "project-title"
                )
                .textContent;

        await savePhotoData(
            project,
            textarea.dataset.file,
            {
                day:
                    textarea.dataset.day,

                comment:
                    textarea.value
            }
        );

    }
);

const storageKey =
    `${project}_${day}_${file}`;

//const savedComment =
//    localStorage.getItem(
//        storageKey
//    );
//
//if (
//    savedComment !== null
//) {
//
//    textarea.value =
//        savedComment;
//
//}

const expandButton =
    document.createElement(
        "button"
    );

expandButton.textContent =
    "✎";

expandButton.className =
    "expand-comment";

expandButton.style.display =
    isAdmin
        ? "block"
        : "none";

expandButton.onclick =
    () => {

        openCommentEditor(
            textarea
        );

    };

wrapper.appendChild(
    expandButton
);
            wrapper.appendChild(
                textarea
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

    applyMode();

}

function updateSelectionCount() {

    const count =
        document.querySelectorAll(
            ".photo-check:checked"
        ).length;

    const info =
        document.getElementById(
            "selection-info"
        );

    info.textContent =
        `Selected: ${count} photos`;

    info.style.display =
        currentMode === "view"
            ? "none"
            : "block";
}

async function loadLogo() {

companyLogo =
    new Image();

companyLogo.src =
    "logo.png";

try {

    const response = await fetch("../logo/site-diary-ui_270.png");

    const blob = await response.blob();

    siteDiaryLogo = await new Promise(resolve => {

        const reader = new FileReader();

        reader.onload = () => resolve(reader.result);

        reader.readAsDataURL(blob);

    });

}
catch {

    siteDiaryLogo = null;

}

    try {

        await companyLogo.decode();

        console.log(
            "Logo loaded"
        );

    } catch {

        console.log(
            "Logo not found"
        );

        companyLogo = null;
    }

}

async function loadProjectInfo() {

    try {

        const response =
            await fetch(
                "project.json"
            );

        projectInfo =
            await response.json();

        console.log(
            "Project loaded:",
            projectInfo
        );

    } catch (e) {

        console.log(
            "Project not found:",
            e
        );

        projectInfo = {};
    }

}

(async () => {

    await loadLogo();

    await loadProjectInfo();

    await loadAbout();

    await loadDiary();

    applyGalleryScale();

})();

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

            document
                .querySelectorAll(
                    ".pdf-error"
                )
                .forEach(
                    e => e.classList.remove(
                        "pdf-error"
                    )
                );

            document
                .querySelectorAll(
                    ".comment-error"
                )            .forEach(
                    e => e.classList.remove(
                        "comment-error"
                    )
                );

            const selected =
                document.querySelectorAll(
                    ".photo-check:checked"
                );

            const photos =
                Array.from(selected);

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


applyPdfFont(
    pdf
);

const s =
    loadPdfSettings();


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


if (s.drawFrame) {

    pdf.rect(
        20,  // X
        5,   // Y
        185, // ширина
        287  // высота
    );
}

if (s.drawLogo && siteDiaryLogo) {

    pdf.addImage(
        siteDiaryLogo,
        "PNG",
        2.5,
        222,
        15,
        70
    );

}

if (s.drawTitleBlock) {

    drawTitleBlock(
        pdf,
        105,
        261
    );

}


// Размер ячейки фото
const cellW = 85;
const cellH = 65;


const totalPages =
    Math.ceil(
        selected.length / 4
    );

let i = 0;
let page = 1;

let hasErrors = false;

while (
    i < photos.length
) {

const testPhotos =
    photos.slice(
        i,
        i + 4
    );

const hasComments =
    testPhotos.some(
        photo => {

            const wrapper =
                photo.parentElement;

            const comment =
                wrapper
                    .querySelector(
                        ".photo-comment"
                    )
                    ?.value || "";

            return (
                comment.trim() !== ""
            );

        }
    );

let pagePhotos;
let positions;

if (
    hasComments
) {

    pagePhotos = 2;

    positions = [

        {x: 25, y: 25},
        {x: 115, y: 25},

    ];

} else {

    pagePhotos = 4;

    positions = [

        {x: 25, y: 25},
        {x: 115, y: 25},

        {x: 25, y: 120},
        {x: 115, y: 120},

    ];
}


// Заголовок страницы

pdf.setFontSize(
    16
);

pdf.text(
    project,
    pageWidth / 2,
    12,
    {
        align: "center"
    }
);

pdf.setFontSize(
    9
);

pdf.text(
    `Page ${page}`,
    202,
    12,
    {
        align: "right"
    }
);

for (
    let j = 0;
    j < pagePhotos &&
    i + j < photos.length;
    j++
) {

    const checkbox =
        photos[
            i + j
        ];

    const pos =
        positions[
            j
        ];

    const wrapper =
        checkbox.parentElement;

    const comment =
        wrapper.querySelector(
            ".photo-comment"
        )?.value || "";

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
    pos.x + cellW / 2,
    pos.y + cellH + 6,
    {
        align: "center"
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

if (
    comment.trim()
        .length > 0
) {

    pdf.setFontSize(
        7
    );

let lines =
    pdf.splitTextToSize(
        comment,
        cellW - 4
    );

if (
    lines.length >
    s.commentLines
) {

    img.classList.add(
        "pdf-error"
    );

    wrapper
        .querySelector(
            ".photo-comment"
        )
        .classList
        .add(
            "comment-error"
        );

    hasErrors = true;
}

pdf.text(
        lines,
        pos.x + 2,
        pos.y + cellH + 16
    );
}

}

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
            `Generated by Site Diary • ${now}`,
            155,
            295
        );

}

i += pagePhotos;

page++;

if (
    i < photos.length
) {

pdf.addPage();

if (s.drawLogo && siteDiaryLogo) {

    pdf.addImage(

        siteDiaryLogo,

        "PNG",

        2.5,
        222,

        15,
        70

    );

}

pdf.setLineWidth(
    0.25
);

if (s.drawFrame) {

    pdf.rect(
        20,
        5,
        185,
        287
    );
}

if (s.drawTitleBlock) {

    drawTitleBlock(
        pdf,
        105,
        261
    );
}

}

}

const now =
    new Date()
        .toISOString()
        .slice(
            0,
            10
        );

if (
    hasErrors
) {

alert(
    "One or more comments exceed "
    + "the maximum limit of "
    + s.commentLines
    + " PDF lines.\n\n"
    + "The photos and comments "
    + "containing errors have "
    + "been highlighted in red."
);

    return;
}

pdf.save(
    `${project}_${now}.pdf`
);
        }
    );

//00001111

let currentTextarea =
    null;

async function showPhoto() {

    const img =
        document.getElementById(
            "viewer-image"
        );

    img.src =
        currentPhotos[
            currentIndex
        ];

const project =
    document
        .getElementById(
            "project-title"
        )
        .textContent;

    const path =
        currentPhotos[
            currentIndex
        ];


console.log(
    "Project:",
    project
);

console.log(
    "Path:",
    path
);


    const parts =
        path.split("/");

const cloud =
    await loadPhotoData(
        project,
        path
    );

console.log(
    "Cloud:",
    cloud
);

    document
        .getElementById(
            "info-file"
        )
        .textContent =
        parts[
            parts.length - 1
        ];

    document
        .getElementById(
            "info-date"
        )
        .textContent =
        parts[
            parts.length - 3
        ];

        if (cloud) {

            console.log(
                "Firebase:",
                cloud
            );

}

}


function toggleInspector() {

    if (
        currentMode !==
        "layout"
    ) {

        return;

    }

    const panel =
        document.getElementById(
            "viewer-info"
        );

    panel.style.display =

        panel.style.display ===
        "none"

            ? "block"

            : "none";

}

function openViewer(
    photos,
    index
) {

    currentPhotos =
        photos;

    currentIndex =
        index;

    showPhoto();

    const viewer =
        document.getElementById(
            "photo-viewer"
        );

    const info =
        document.getElementById(
            "viewer-info"
        );

    const infoButton =
        document.getElementById(
            "viewer-info-btn"
        );

    if (
        currentMode === "layout"
    ) {

        info.style.display =
            "block";

        infoButton.style.display =
            "inline-block";

    }
    else {

        info.style.display =
            "none";

        infoButton.style.display =
            "none";

    }

    viewer.style.display =
        "block";
}

function closeViewer() {

    document
        .getElementById(
            "photo-viewer"
        )
        .style.display =
            "none";
}

function nextPhoto() {

    currentIndex++;

    if (
        currentIndex >=
        currentPhotos.length
    ) {

        currentIndex = 0;
    }

    showPhoto();
}

function prevPhoto() {

    currentIndex--;

    if (
        currentIndex < 0
    ) {

        currentIndex =
            currentPhotos.length - 1;
    }

    showPhoto();
}


function saveEditorState() {

    const editor =
        document.getElementById(
            "editor-window"
        );

    localStorage.setItem(
        "editor-left",
        editor.style.left
    );

    localStorage.setItem(
        "editor-top",
        editor.style.top
    );

    localStorage.setItem(
        "editor-width",
        editor.style.width
    );

    localStorage.setItem(
        "editor-height",
        editor.style.height
    );

}


function loadEditorState() {

    const editor =
        document.getElementById(
            "editor-window"
        );

    editor.style.left =
        localStorage.getItem(
            "editor-left"
        ) || "120px";

    editor.style.top =
        localStorage.getItem(
            "editor-top"
        ) || "80px";

    editor.style.width =
        localStorage.getItem(
            "editor-width"
        ) || "1200px";

    editor.style.height =
        localStorage.getItem(
            "editor-height"
        ) || "800px";

}


function openCommentEditor(
    sourceTextarea
) {

    currentTextarea =
        sourceTextarea;

    document
        .getElementById(
            "editor-text"
        )
        .value =
            sourceTextarea.value;

    document
        .getElementById(
            "editor-modal"
        )
        .style.display =
            "flex";

    loadEditorState();

}


function closeCommentEditor() {

    saveEditorState();

    document
        .getElementById(
            "editor-modal"
        )
        .style.display =
            "none";

    currentTextarea =
        null;
}



async function saveCommentEditor() {

    if (!currentTextarea)
        return;

    currentTextarea.value =
        document
            .getElementById(
                "editor-text"
            )
            .value;

const project =
    document
        .getElementById(
            "project-title"
        )
        .textContent;

const path =
    currentPhotos[
        currentIndex
    ];

console.log(
    "Project:",
    project
);

console.log(
    "Path:",
    path
);


await savePhotoData(
    project,
    currentTextarea.dataset.file,
    {
        day:
            currentTextarea.dataset.day,

        comment:
            currentTextarea.value
    }
);

closeCommentEditor();

}

document
    .getElementById(
        "editor-save"
    )
    .addEventListener(
        "click",
        saveCommentEditor
    );


document
    .getElementById(
        "editor-cancel"
    )
    .addEventListener(
        "click",
        closeCommentEditor
    );


let isDragging = false;
let offsetX = 0;
let offsetY = 0;

const modal =
    document.getElementById(
        "editor-window"
    );

const header =
    document.getElementById(
        "editor-header"
    );

header.addEventListener(
    "mousedown",
    e => {

        isDragging = true;

        offsetX =
            e.clientX -
            modal.offsetLeft;

        offsetY =
            e.clientY -
            modal.offsetTop;
    }
);

document.addEventListener(
    "mousemove",
    e => {

        if (!isDragging)
            return;

        modal.style.left =
            (e.clientX - offsetX)
            + "px";

        modal.style.top =
            (e.clientY - offsetY)
            + "px";
    }
);

document.addEventListener(
    "mouseup",
    () => {

        if (
            isDragging
        ) {

            saveEditorState();

        }

        isDragging = false;
    }
);

document
    .getElementById(
        "editor-close"
    )
    .addEventListener(
        "click",
        closeCommentEditor
    );


document
    .getElementById(
        "editor-modal"
    )
    .addEventListener(
        "mousedown",
        async e => {

            const windowEl =
                document.getElementById(
                    "editor-window"
                );

            if (
                !windowEl.contains(
                    e.target
                )
            ) {

                await saveCommentEditor();

            }

        }
    );

document
    .getElementById(
        "viewer-prev"
    )
    .addEventListener(
        "click",
        prevPhoto
    );

document
    .getElementById(
        "viewer-next"
    )
    .addEventListener(
        "click",
        nextPhoto
    );

document
    .getElementById(
        "viewer-close"
    )
    .addEventListener(
        "click",
        closeViewer
    );

document
    .getElementById(
        "viewer-info-btn"
    )
    .addEventListener(
        "click",
        toggleInspector
    );

document
    .getElementById(
        "viewer-info-btn"
    )
    .addEventListener(
        "click",
        toggleInspector
    );


document.addEventListener(
    "keydown",
    e => {

        const viewer =
            document.getElementById(
                "photo-viewer"
            );

        if (
            viewer.style.display !==
            "flex"
        ) {

            return;
        }

        if (
            e.key ===
            "ArrowLeft"
        ) {

            prevPhoto();
        }

        if (
            e.key ===
            "ArrowRight"
        ) {

            nextPhoto();
        }

        if (
            e.key ===
            "Escape"
        ) {

            closeViewer();
        }

    }
);


document
    .getElementById(
        "photo-viewer"
    )
    .addEventListener(
        "click",
        e => {

            if (
                e.target.id ===
                "photo-viewer"
            ) {

                closeViewer();
            }

        }
    );

const resizeObserver =
    new ResizeObserver(
        () => {

            saveEditorState();

        }
    );

resizeObserver.observe(
    document.getElementById(
        "editor-window"
    )
);

document
    .getElementById(
        "settings-btn"
    )
    .addEventListener(
        "click",
        () => {

const s =
    loadPdfSettings();

document
    .getElementById(
        "pdf-text-size"
    )
    .value =
        s.textSize;

document
    .getElementById(
        "pdf-comment-lines"
    )
    .value =
        s.commentLines;

document
    .getElementById(
        "pdf-stamp-size"
    )
    .value =
        s.stampSize;

document
    .getElementById(
        "pdf-stamp-charspace"
    )
    .value =
        s.stampCharSpace;

document
    .getElementById(
        "pdf-draw-frame"
    )
    .checked =
        s.drawFrame;

document
    .getElementById(
        "pdf-draw-title-block"
    )
    .checked =
        s.drawTitleBlock;

document
    .getElementById(
        "pdf-draw-logo"
    )
    .checked =
        s.drawLogo;

document
    .getElementById(
        "settings-modal"
    )
    .style.display =
        "block";
        }
    );

document
    .getElementById(
        "settings-save"
    )
    .addEventListener(
        "click",
        () => {

            savePdfSettings();

            document
                .getElementById(
                    "settings-modal"
                )
                .style.display =
                    "none";
        }
    );

document
    .getElementById(
        "settings-cancel"
    )
    .addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "settings-modal"
                )
                .style.display =
                    "none";
        }
    );

document
    .getElementById(
        "pdf-comment-lines"
    )
    .addEventListener(
        "input",
        e => {

            let value =
                parseInt(
                    e.target.value
                ) || 1;

            if (
                value > 55
            ) {

                value = 55;

            }

            if (
                value < 1
            ) {

                value = 1;

            }

            e.target.value =
                value;
        }
    );


function setActiveTab() {

    document
        .querySelectorAll(
            ".mode-tabs button"
        )
        .forEach(
            btn => {

                btn.classList.remove(
                    "active"
                );

            }
        );

    document
        .getElementById(
            `${currentMode}-tab`
        )
        .classList.add(
            "active"
        );

}


// ВКЛЮЧЕНИЕ ИНТЕРФЕЙСА ДЛЯ РАЗНЫХ РЕЖИМОВ

function applyMode() {

    const isView =
        currentMode === "view";

    const isAdmin =
        currentMode === "admin";

    const isLayout =
        currentMode === "layout";

    const isAbout =
        currentMode === "about";


const galleryPage =
    document.getElementById(
        "gallery-page"
    );

const aboutPage =
    document.getElementById(
        "about-page"
    );

// Верхняя информация проекта

const projectInfo =
    document.getElementById(
        "project-info"
    );

if (projectInfo) {

    projectInfo.style.display =
        isAbout
            ? "none"
            : "block";
}


// Блок "Selected: ..."

const selectionInfo =
    document.getElementById(
        "selection-info"
    );

if (selectionInfo) {

    selectionInfo.style.display =
        (isAdmin || isLayout)
            ? "block"
            : "none";
}


// Ползунок размера фотографий

const galleryScaleContainer =
    document.getElementById(
        "gallery-scale-container"
    );

if (galleryScaleContainer) {

    galleryScaleContainer.style.display =
        isView
            ? "block"
            : "none";

}


// Панель кнопок

const selectionButtons =
    document.querySelector(
        ".selection-buttons"
    );

if (selectionButtons) {

    selectionButtons.style.display =
        isAbout
            ? "none"
            : "block";
}




if (galleryPage) {

    galleryPage.style.display =
        isAbout
            ? "none"
            : "block";

}

if (aboutPage) {

    aboutPage.style.display =
        isAbout
            ? "block"
            : "none";

}


    // комментарии под фото

    document
        .querySelectorAll(
            ".photo-comment"
        )
        .forEach(
            el => {

                el.style.display =
                    (isAdmin || isLayout)
                        ? "block"
                        : "none";

            }
        );


    // кнопка раскрытия комментария

    document
        .querySelectorAll(
            ".expand-comment"
        )
        .forEach(
            el => {

                el.style.display =
                    (isAdmin || isLayout)
                        ? "block"
                        : "none";

            }
        );


// чекбоксы выбора

document
    .querySelectorAll(
        ".photo-check"
    )
    .forEach(
        el => {

            el.style.display =
                isView
                    ? "none"
                    : "block";

        }
    );


const controls = [

    "select-all",
    "clear-all",
    "export-pdf",
    "settings-btn"

];

controls.forEach(
    id => {

        const el =
            document.getElementById(
                id
            );

        if (el) {

el.style.display =
    (isAdmin || isLayout)
        ? "inline-block"
        : "none";

        }

    }
);


    console.log(
        "Apply mode:",
        currentMode
    );

}

document
    .getElementById("view-tab")
    .addEventListener(
        "click",
        () => {

currentMode = "view";


console.log(
    "ABOUT BUTTON:",
    document.getElementById("about-tab")
);

setActiveTab();

applyMode();

console.log(
    "Mode:",
    currentMode
);

        }
    );

document
    .getElementById("admin-tab")
    .addEventListener(
        "click",
        () => {

            const password =
                prompt(
                    "Admin password"
                );

if (
    password === null
) {

    return;
}

if (
    password !==
    ADMIN_PASSWORD
) {

    alert(
        "Invalid admin password"
    );

    return;
}

currentMode =
    "admin";

setActiveTab();

applyMode();

console.log(
    "Mode:",
    currentMode
);

        }
    );

document
    .getElementById("layout-tab")
    .addEventListener(
        "click",
        () => {

            const password =
                prompt(
                    "Layout password"
                );

            if (
                password === null
            ) {

                return;
            }

            if (
                password !==
                LAYOUT_PASSWORD
            ) {

                alert(
                    "Invalid layout password"
                );

                return;
            }

            currentMode =
                "layout";

            setActiveTab();

            applyMode();

            console.log(
                "Mode:",
                currentMode
            );

        }
    );

document
    .getElementById("about-tab")
    .addEventListener(
        "click",
        () => {

            currentMode =
                "about";

            setActiveTab();

            applyMode();

            console.log(
                "Mode:",
                currentMode
            );

        }
    );


setActiveTab();

applyMode();

//--------------------------------------------------
// Ползунок плотности галереи
//--------------------------------------------------

const galleryScaleSlider =
    document.getElementById(
        "gallery-scale"
    );

if (galleryScaleSlider) {

    galleryScaleSlider.addEventListener(

        "input",

        function () {

            localStorage.setItem(

                "gallery-density",

                this.value

            );

            applyGalleryScale();

        }

    );

}

//--------------------------------------------------
// Перестроение галереи при изменении окна
//--------------------------------------------------

window.addEventListener(

    "resize",

    applyGalleryScale

);