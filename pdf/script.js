 // Initialize PDF.js worker
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.9.179/pdf.worker.min.js';

        // Global variables
        let selectedTool = null;
        let currentFiles = [];

        // Theme Toggle Functionality
        function toggleTheme() {
            const theme = document.documentElement.getAttribute('data-theme');
            const newTheme = theme === 'dark' ? 'light' : 'dark';
            const icon = document.querySelector('.theme-toggle i');

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Update icon
            icon.className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        }

        // Initialize theme from local storage
        document.addEventListener('DOMContentLoaded', () => {
            const savedTheme = localStorage.getItem('theme') || 'light';
            
            document.documentElement.setAttribute('data-theme', savedTheme);
            
            const icon = document.querySelector('.theme-toggle i');
            icon.className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';

            // Setup file input event listener
            document.getElementById('fileInput').addEventListener('change', handleFileSelect);

            // Initialize page states
            document.getElementById('toolsPage').style.display = 'none';
            document.getElementById('landingPage').style.display = 'block';
        });

        // Handle file selection
        function handleFileSelect(event) {
            const files = event.target.files;
            const fileInfo = document.getElementById('fileInfo');
            const processButton = document.getElementById('processButton');
            const preview = document.getElementById('preview');
            
            currentFiles = Array.from(files);
            
            if (files.length > 0) {
                let fileList = '';
                for (let i = 0; i < files.length; i++) {
                    fileList += `${files[i].name} (${formatFileSize(files[i].size)})<br>`;
                }
                fileInfo.innerHTML = `<strong>Selected files:</strong><br>${fileList}`;
                processButton.disabled = false;
                
                // Show preview for images
                preview.innerHTML = '';
                if (selectedTool && selectedTool.includes('jpg') || selectedTool === 'jpgToPdf') {
                    Array.from(files).forEach(file => {
                        if (file.type.startsWith('image/')) {
                            const img = document.createElement('img');
                            img.src = URL.createObjectURL(file);
                            img.style.maxWidth = '200px';
                            img.style.margin = '5px';
                            img.classList.add('no-invert');
                            preview.appendChild(img);
                        }
                    });
                }
            } else {
                fileInfo.innerHTML = '';
                processButton.disabled = true;
            }
        }

        // Format file size
        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }

        // Open tool modal
        function openTool(toolName) {
            selectedTool = toolName;
            const modal = document.getElementById('toolModal');
            const modalTitle = document.getElementById('modalTitle');
            const fileInput = document.getElementById('fileInput');
            const processButton = document.getElementById('processButton');
            const fileInfo = document.getElementById('fileInfo');
            const preview = document.getElementById('preview');

            // Reset modal
            fileInput.value = '';
            fileInfo.innerHTML = '';
            preview.innerHTML = '';
            processButton.disabled = true;
            document.getElementById('progress').style.width = '0%';

            // Set modal title
            modalTitle.textContent = toolName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

            // Set accepted file types based on tool
            if (toolName.includes('jpg') || toolName.includes('image') || toolName === 'jpgToPdf') {
                fileInput.accept = 'image/*';
            } else if (toolName.includes('pdf')) {
                fileInput.accept = '.pdf';
            } else if (toolName.includes('word') || toolName.includes('doc')) {
                fileInput.accept = '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            } else if (toolName.includes('excel') || toolName.includes('xls')) {
                fileInput.accept = '.xls,.xlsx';
            } else if (toolName.includes('ppt') || toolName.includes('powerpoint')) {
                fileInput.accept = '.ppt,.pptx';
            }

            // Configure multiple file selection
            fileInput.multiple = toolName === 'mergePdf' || toolName === 'jpgToPdf';

            // Set up process button click handler
            processButton.onclick = () => processTool(toolName);

            // Show modal
            modal.style.display = 'block';
        }

        // Close modal
        function closeModal() {
            document.getElementById('toolModal').style.display = 'none';
            document.getElementById('preview').innerHTML = '';
            document.getElementById('progress').style.width = '0%';
            selectedTool = null;
            currentFiles = [];
        }

        // Show tools page
        function showToolsPage() {
            // Hide landing page with fade out effect
            hideAllPages();
            
            // Show tools page with fade in effect
            const toolsPage = document.getElementById('toolsPage');
            toolsPage.style.display = 'block';
            toolsPage.style.opacity = '0';
            
            // Add header section that was missing
            if (!document.querySelector('#toolsPage .header')) {
                const header = document.createElement('div');
                header.className = 'header';
                header.innerHTML = `
                    <h1>PDF Tools & Converter</h1>
                    <p>All-in-one PDF solution for your document needs. Edit, convert, compress, and more with our easy-to-use tools.</p>
                `;
                toolsPage.insertBefore(header, toolsPage.firstChild);
            }
            
            // Trigger reflow
            toolsPage.offsetHeight;
            
            toolsPage.style.transition = 'opacity 0.5s ease';
            toolsPage.style.opacity = '1';
        }

        // Show tools info page
        function showToolsInfo() {
            document.getElementById('toolsPage').style.display = 'none';
            document.getElementById('landingPage').style.display = 'none';
            document.getElementById('toolsInfoPage').style.display = 'block';
        }

        // Show features page
        function showFeaturesPage() {
            hideAllPages();
            document.getElementById('featuresPage').style.display = 'block';
        }

        // Show about page
        function showAboutPage() {
            hideAllPages();
            document.getElementById('aboutPage').style.display = 'block';
        }

        // Show contact page
        function showContactPage() {
            hideAllPages();
            document.getElementById('contactPage').style.display = 'block';
        }

        // Hide all pages
        function hideAllPages() {
            document.getElementById('landingPage').style.display = 'none';
            document.getElementById('toolsPage').style.display = 'none';
            document.getElementById('toolsInfoPage').style.display = 'none';
            document.getElementById('featuresPage'). style.display = 'none';
            document.getElementById('aboutPage').style.display = 'none';
            document.getElementById('contactPage').style.display = 'none';
        }

        // Process the selected tool
        async function processTool(toolName) {
            const files = currentFiles;
            const progressBar = document.getElementById('progress');
            const preview = document.getElementById('preview');
            const processButton = document.getElementById('processButton');

            if (files.length === 0) {
                alert('Please select file(s) first');
                return;
            }

            // Disable process button during processing
            processButton.disabled = true;

            try {
                progressBar.style.width = '30%';
                
                // Add to history for each file
                files.forEach(file => {
                    addToHistory(file, toolName);
                });

                // Based on the tool, call the appropriate function
                switch (toolName) {
                    case 'mergePdf':
                        await mergePDFs(files);
                        break;
                    case 'jpgToPdf':
                        await convertImagesToPDF(files);
                        break;
                    case 'splitPdf':
                        await splitPDF(files[0]);
                        break;
                    case 'rotatePdf':
                        await rotatePDF(files[0]);
                        break;
                    case 'addWatermark':
                        await addWatermark(files[0]);
                        break;
                    case 'compressPdf':
                        await compressPDF(files[0]);
                        break;
                    case 'pdfToJpg':
                        await convertPDFToImages(files[0]);
                        break;
                    default:
                        // For tools that aren't implemented, show a message
                        preview.innerHTML = `<div style="padding: 20px; text-align: center;">
                            <i class="fas fa-tools" style="font-size: 3rem; color: var(--accent-color); margin-bottom: 1rem;"></i>
                            <h3>This tool is coming soon!</h3>
                            <p>We're working hard to implement ${toolName.replace(/([A-Z])/g, ' $1')} functionality.</p>
                        </div>`;
                        // Simulate progress for demonstration
                        simulateProgress();
                        return;
                }

                progressBar.style.width = '100%';
                
                // Re-enable button after a short delay
                setTimeout(() => {
                    processButton.disabled = false;
                }, 2000);
            } catch (error) {
                alert('An error occurred: ' + error.message);
                progressBar.style.width = '0%';
                processButton.disabled = false;
            }
        }

        // Simulate progress for unimplemented tools
        function simulateProgress() {
            const progressBar = document.getElementById('progress');
            let width = 0;
            const interval = setInterval(() => {
                if (width >= 100) {
                    clearInterval(interval);
                    progressBar.style.width = '0%';
                } else {
                    width += 5;
                    progressBar.style.width = width + '%';
                }
            }, 100);
        }

        // Merge PDFs function
        async function mergePDFs(files) {
            const mergedPdf = await PDFLib.PDFDocument.create();
            
            for (const file of files) {
                const pdfBytes = await file.arrayBuffer();
                const pdf = await PDFLib.PDFDocument.load(pdfBytes);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }

            const mergedPdfBytes = await mergedPdf.save();
            downloadFile(mergedPdfBytes, 'merged-document.pdf', 'application/pdf');
        }

        // Convert Images to PDF function
        async function convertImagesToPDF(files) {
            const pdfDoc = await PDFLib.PDFDocument.create();
            
            for (const file of files) {
                const imageBytes = await file.arrayBuffer();
                let image;
                
                if (file.type === 'image/jpeg') {
                    image = await pdfDoc.embedJpg(imageBytes);
                } else if (file.type === 'image/png') {
                    image = await pdfDoc.embedPng(imageBytes);
                } else {
                    continue; // Skip non-image files
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
            downloadFile(pdfBytes, 'converted-images.pdf', 'application/pdf');
        }

        // Split PDF function
        async function splitPDF(file) {
            const pdfBytes = await file.arrayBuffer();
            const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
            const numberOfPages = pdfDoc.getPageCount();
            
            for (let i = 0; i < numberOfPages; i++) {
                const newPdf = await PDFLib.PDFDocument.create();
                const [page] = await newPdf.copyPages(pdfDoc, [i]);
                newPdf.addPage(page);
                const pdfBytes = await newPdf.save();
                downloadFile(pdfBytes, `page-${i+1}.pdf`, 'application/pdf');
            }
        }

        // Rotate PDF function
        async function rotatePDF(file) {
            const pdfBytes = await file.arrayBuffer();
            const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
            const pages = pdfDoc.getPages();
            
            // Rotate each page 90 degrees clockwise
            pages.forEach(page => {
                page.setRotation(PDFLib.degrees(90));
            });

            const rotatedPdfBytes = await pdfDoc.save();
            downloadFile(rotatedPdfBytes, 'rotated-document.pdf', 'application/pdf');
        }

        // Add Watermark function
        async function addWatermark(file) {
            const pdfBytes = await file.arrayBuffer();
            const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
            const pages = pdfDoc.getPages();
            
            const watermarkText = "CONFIDENTIAL";
            const font = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold);
            
            pages.forEach(page => {
                const { width, height } = page.getSize();
                page.drawText(watermarkText, {
                    x: width / 2 - 100,
                    y: height / 2,
                    size: 40,
                    font: font,
                    color: PDFLib.rgb(0.5, 0.5, 0.5),
                    opacity: 0.3,
                    rotate: PDFLib.degrees(45),
                });
            });

            const watermarkedPdfBytes = await pdfDoc.save();
            downloadFile(watermarkedPdfBytes, 'watermarked-document.pdf', 'application/pdf');
        }

        // Compress PDF function (simulated)
        async function compressPDF(file) {
            // This is a simulation since real compression requires more advanced processing
            const pdfBytes = await file.arrayBuffer();
            downloadFile(pdfBytes, 'compressed-document.pdf', 'application/pdf');
        }

        // Convert PDF to Images function
        async function convertPDFToImages(file) {
            const pdfBytes = await file.arrayBuffer();
            
            // Load the PDF document
            const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
            const pdf = await loadingTask.promise;
            const preview = document.getElementById('preview');
            
            preview.innerHTML = '<p>Converting PDF pages to images...</p>';
            
            // Convert each page to an image
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 1.5 });
                
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                
                await page.render({
                    canvasContext: context,
                    viewport: viewport
                }).promise;
                
                // Convert canvas to image and download
                const imgData = canvas.toDataURL('image/jpeg');
                const link = document.createElement('a');
                link.href = imgData;
                link.download = `page-${i}.jpg`;
                link.click();
            }
            
            preview.innerHTML += '<p>Conversion complete! All pages downloaded as images.</p>';
        }

        // Download file function
        function downloadFile(data, fileName, mimeType) {
            const blob = new Blob([data], { type: mimeType });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
        }

        // Close modal if clicked outside
        window.onclick = function(event) {
            const modal = document.getElementById('toolModal');
            if (event.target === modal) {
                closeModal();
            }
        };

        // Enable drag and drop for file input
        const fileInputContainer = document.querySelector('.file-input-container');
        fileInputContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileInputContainer.style.borderColor = 'var(--primary-color)';
            fileInputContainer.style.backgroundColor = 'rgba(76, 201, 240, 0.1)';
        });

        fileInputContainer.addEventListener('dragleave', () => {
            fileInputContainer.style.borderColor = 'var(--accent-color)';
            fileInputContainer.style.backgroundColor = 'var(--bg-secondary)';
        });

        fileInputContainer.addEventListener('drop', (e) => {
            e.preventDefault();
            fileInputContainer.style.borderColor = 'var(--accent-color)';
            fileInputContainer.style.backgroundColor = 'var(--bg-secondary)';
            
            const files = e.dataTransfer.files;
            document.getElementById('fileInput').files = files;
            handleFileSelect({ target: document.getElementById('fileInput') });
        });

        // File history management
        let fileHistory = JSON.parse(localStorage.getItem('fileHistory') || '[]');
        const MAX_HISTORY_ITEMS = 50; // Maximum number of items to keep in history

        // Function to add file to history
        function addToHistory(file, operation) {
            const historyItem = {
                id: Date.now(), // Unique ID for the history item
                name: file.name,
                size: file.size,
                type: file.type,
                operation: operation,
                date: new Date().toISOString(),
                timestamp: Date.now()
            };

            fileHistory.unshift(historyItem); // Add to beginning of array

            // Keep only the last MAX_HISTORY_ITEMS items
            if (fileHistory.length > MAX_HISTORY_ITEMS) {
                fileHistory = fileHistory.slice(0, MAX_HISTORY_ITEMS);
            }

            // Save to localStorage
            localStorage.setItem('fileHistory', JSON.stringify(fileHistory));
            
            // Update history display if modal is open
            if (document.getElementById('historyModal').style.display === 'block') {
                displayHistory();
            }
        }

        // Function to display history
        function displayHistory() {
            const historyList = document.getElementById('historyList');
            historyList.innerHTML = '';

            if (fileHistory.length === 0) {
                historyList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No history found</p>';
                return;
            }

            fileHistory.forEach(item => {
                const date = new Date(item.date).toLocaleString();
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                historyItem.innerHTML = `
                    <div class="history-item-info">
                        <div class="history-item-name">${item.name}</div>
                        <div class="history-item-date">
                            <i class="fas fa-clock"></i> ${date}
                            <span style="margin-left: 1rem;">
                                <i class="fas fa-tools"></i> ${item.operation}
                            </span>
                        </div>
                    </div>
                    <div class="history-item-actions">
                        <button class="history-button" onclick="deleteHistoryItem(${item.id})" title="Delete from history">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                historyList.appendChild(historyItem);
            });
        }

        // Function to clear all history
        function clearHistory() {
            if (confirm('Are you sure you want to clear all file history?')) {
                fileHistory = [];
                localStorage.setItem('fileHistory', JSON.stringify(fileHistory));
                displayHistory();
            }
        }

        // Function to delete single history item
        function deleteHistoryItem(id) {
            fileHistory = fileHistory.filter(item => item.id !== id);
            localStorage.setItem('fileHistory', JSON.stringify(fileHistory));
            displayHistory();
        }

        // Function to show history modal
        function showHistoryModal() {
            const modal = document.getElementById('historyModal');
            modal.style.display = 'block';
            displayHistory();
        }

        // Function to close history modal
        function closeHistoryModal() {
            document.getElementById('historyModal').style.display = 'none';
        }

        // Add history button to navigation
        document.addEventListener('DOMContentLoaded', () => {
            // Update the navigation links
            const navLinks = document.querySelector('.nav-links');
            navLinks.innerHTML = `
                <a href="#" onclick="showToolsPage(); return false;">Tools</a>
                <a href="#" onclick="showFeaturesPage(); return false;">Features</a>
                <a href="#" onclick="showAboutPage(); return false;">About</a>
                <a href="#" onclick="showContactPage(); return false;">Contact</a>
                <a href="#" onclick="showHistoryModal(); return false;"><i class="fas fa-history"></i> History</a>
            `;

            // Add contact form submission handler
            document.getElementById('contactForm').addEventListener('submit', function(e) {
                e.preventDefault();
                alert('Thank you for your message! We will get back to you soon.');
                this.reset();
            });
        });