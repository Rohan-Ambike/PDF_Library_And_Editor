// P2I - PDF to Images

let zipPNG = new JSZip();
let zipJPG = new JSZip();
let imagesPNG = [];
let imagesJPG = [];

$('#fileInputPNGP2I').change(function (event) {
    handleFileSelect(event, 'png');
});

$('#fileInputJPGP2I').change(function (event) {
    handleFileSelect(event, 'jpg');
});

$('#outputJPGP2I').html('').hide();
$('#outputPNGP2I').html('').hide();

function handleFileSelect(event, fileType) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        const typedArray = new Uint8Array(event.target.result);
        renderPDF(typedArray, fileType);
    };
    reader.readAsArrayBuffer(file);
}

function renderPDF(data, fileType) {
    pdfjsLib.getDocument(data).promise.then(function (pdf) {
        let promises = [];
        for (let i = 1; i <= pdf.numPages; i++) {
            promises.push(renderPage(pdf, i, fileType));
        }
        Promise.all(promises).then(() => {
            let downloadBtn, refreshBtn, zip, images, output;
            if (fileType === 'png') {
                downloadBtn = $('#downloadBtnPNGP2I');
                refreshBtn = $('#refreshBtnPNGP2I');
                zip = zipPNG;
                images = imagesPNG;
                output = $('#outputPNGP2I');
            } else if (fileType === 'jpg') {
                downloadBtn = $('#downloadBtnJPGP2I');
                refreshBtn = $('#refreshBtnJPGP2I');
                zip = zipJPG;
                images = imagesJPG;
                output = $('#outputJPGP2I');
            }
            downloadBtn.show();
            refreshBtn.show();
            output.show();
        });
    });
}

function renderPage(pdf, pageNum, fileType) {
    return pdf.getPage(pageNum).then(function (page) {
        const scale = 1.5;
        const viewport = page.getViewport({ scale: scale });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };

        return page.render(renderContext).promise.then(function () {
            let zip, images, output;
            if (fileType === 'png') {
                zip = zipPNG;
                images = imagesPNG;
                output = $('#outputPNGP2I');
            } else if (fileType === 'jpg') {
                zip = zipJPG;
                images = imagesJPG;
                output = $('#outputJPGP2I');
            }
            const imgData = canvas.toDataURL(`image/${fileType === 'png' ? 'png' : 'jpeg'}`);
            zip.file(`page_${pageNum}.${fileType === 'png' ? 'png' : 'jpg'}`, imgData.split('base64,')[1], { base64: true });
            images.push(imgData);

            const img = new Image();
            img.src = imgData;
            img.className = 'converted-image';
            output.append(img);
        });
    });
}

$('#downloadBtnPNGP2I').click(function () {
    zipPNG.generateAsync({ type: "blob" }).then(function (content) {
        saveAs(content, "images_png.zip");
    });
});

$('#downloadBtnJPGP2I').click(function () {
    zipJPG.generateAsync({ type: "blob" }).then(function (content) {
        saveAs(content, "images_jpg.zip");
    });
});

$('#refreshBtnPNGP2I').click(function () {
    imagesPNG = [];
    zipPNG = new JSZip();
    $('#outputPNGP2I').html('').hide();
    $('#downloadBtnPNGP2I').hide();
    $('#refreshBtnPNGP2I').hide();
    $('#fileInputPNGP2I').val('');
});

$('#refreshBtnJPGP2I').click(function () {
    imagesJPG = [];
    zipJPG = new JSZip();
    $('#outputJPGP2I').html('').hide();
    $('#downloadBtnJPGP2I').hide();
    $('#refreshBtnJPGP2I').hide();
    $('#fileInputJPGP2I').val('');
});



// I2P - Images to PDF

let fileType = "png";

$('#fileInputPNGI2P').on('change', async function () {
    fileType = "png";
    await convertToPdf('fileInputPNGI2P', 'downloadLinkPNGI2P', 'viewPdfLinkPNGI2P', 'refreshBtnPNGI2P', 'pdfViewerPNGI2P');
});

$('#fileInputJPGI2P').on('change', async function () {
    fileType = "jpg";
    await convertToPdf('fileInputJPGI2P', 'downloadLinkJPGI2P', 'viewPdfLinkJPGI2P', 'refreshBtnJPGI2P', 'pdfViewerJPGI2P');
});

async function convertToPdf(inputId, downloadLinkId, viewPdfLinkId, refreshBtnId, pdfViewerId) {
    const fileInput = document.getElementById(inputId);
    const files = fileInput.files;
    if (files.length === 0) {
        alert('Please select at least one image');
        return;
    }

    const pdfDoc = await PDFLib.PDFDocument.create();
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const imageData = await readFileAsArrayBuffer(file);
        let image;
        if (fileType === "png") {
            image = await pdfDoc.embedPng(imageData);
        } else if (fileType === "jpg") {
            image = await pdfDoc.embedJpg(imageData);
        }
        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, {
            x: 0,
            y: 0,
            width: image.width,
            height: image.height,
        });
    }

    const pdfBytes = await pdfDoc.save();
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });

    const downloadLink = document.getElementById(downloadLinkId);
    downloadLink.href = URL.createObjectURL(pdfBlob);
    downloadLink.download = 'converted.pdf';
    downloadLink.style.display = 'none';

    const viewPdfLink = document.getElementById(viewPdfLinkId);
    viewPdfLink.onclick = function () {
        const pdfViewer = document.getElementById(pdfViewerId);
        pdfViewer.innerHTML = `<embed src="${URL.createObjectURL(pdfBlob)}" type="application/pdf" width="100%" height="600px" />`;
        pdfViewer.style.display = 'block';
        downloadLink.style.display = 'inline-block';
        viewPdfLink.style.display = 'none';
    };
    viewPdfLink.style.display = 'inline-block';

    const refreshBtn = document.getElementById(refreshBtnId);
    refreshBtn.style.display = 'inline-block';
}

$('#refreshBtnPNGI2P').click(function () {
    $('#fileInputPNGI2P').val('');
    $('#downloadLinkPNGI2P').hide();
    $('#viewPdfLinkPNGI2P').hide();
    $('#refreshBtnPNGI2P').hide();
    $('#pdfViewerPNGI2P').hide();
});

$('#refreshBtnJPGI2P').click(function () {
    $('#fileInputJPGI2P').val('');
    $('#downloadLinkJPGI2P').hide();
    $('#viewPdfLinkJPGI2P').hide();
    $('#refreshBtnJPGI2P').hide();
    $('#pdfViewerJPGI2P').hide();
});

function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(new Uint8Array(reader.result));
        reader.onerror = error => reject(error);
        reader.readAsArrayBuffer(file);
    });
}

// Merge

$('#mergeBtn').click(async function () {
    const files = $('#mergeFileInput')[0].files;
    if (files.length < 2) {
        alert('Please select at least two PDF files to merge');
        return;
    }

    const pdfDocs = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const pdfBytes = await readFileAsArrayBuffer(file);
        const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
        pdfDocs.push(pdfDoc);
    }

    const mergedPdf = await mergePDFs(pdfDocs);
    const mergedPdfBlob = new Blob([mergedPdf], { type: 'application/pdf' });
    const downloadLink = $('#mergeDownloadLink');
    downloadLink.attr('href', URL.createObjectURL(mergedPdfBlob)).attr('download', 'merged.pdf').show();

    const pdfViewer = $('#mergePdfViewer');
    pdfViewer.html(`<embed src="${URL.createObjectURL(mergedPdfBlob)}" type="application/pdf" width="100%" height="600px" />`).show();

    $('#mergeRefreshBtn').show();
    $('#mergeBtn').hide();
});

async function mergePDFs(pdfDocs) {
    const mergedPdf = await PDFLib.PDFDocument.create();

    for (let i = 0; i < pdfDocs.length; i++) {
        const pdfDoc = pdfDocs[i];
        const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        pages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    return mergedPdfBytes;
}

$('#mergeRefreshBtn').click(function () {
    $('#mergeFileInput').val('');
    $('#mergeDownloadLink').hide();
    $('#mergePdfViewer').hide();
    $('#mergeRefreshBtn').hide();
    $('#mergeBtn').show();
});


// Compress

$('#compressBtn').click(async function () {
    const fileInput = $('#compressFileInput')[0];
    const file = fileInput.files[0];
    if (!file) {
        alert('Please select a PDF file');
        return;
    }

    const reader = new FileReader();
    reader.onload = async function (event) {
        const pdfBytes = new Uint8Array(event.target.result);
        const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
        const compressedPdfBytes = await pdfDoc.save({ useObjectStreams: false });

        const compressedPdfBlob = new Blob([compressedPdfBytes], { type: 'application/pdf' });
        const downloadLink = $('#compressDownloadLink');
        downloadLink.attr('href', URL.createObjectURL(compressedPdfBlob)).attr('download', 'compressed.pdf').show();

        const pdfViewer = $('#compressPdfViewer');
        pdfViewer.html(`<embed src="${URL.createObjectURL(compressedPdfBlob)}" type="application/pdf" width="100%" height="600px" />`).show();

        $('#compressRefreshBtn').show();
        $('#compressBtn').hide();
    };
    reader.readAsArrayBuffer(file);
});

$('#compressRefreshBtn').click(function () {
    $('#compressFileInput').val('');
    $('#compressDownloadLink').hide();
    $('#compressPdfViewer').hide();
    $('#compressRefreshBtn').hide();
    $('#compressBtn').show();
});

function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(new Uint8Array(reader.result));
        reader.onerror = error => reject(error);
        reader.readAsArrayBuffer(file);
    });
}