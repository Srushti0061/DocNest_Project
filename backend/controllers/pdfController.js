const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { createCanvas } = require('canvas');
const { Chart, registerables } = require('chart.js');
Chart.register(...registerables);
const Evaluation = require('../models/Evaluation');
const StudentSubmission = require('../models/StudentSubmission');
const Criteria = require('../models/Criteria');

// Helper function to generate a bar chart
async function generateBarChart(labels, data, title) {
    const width = 600;
    const height = 400;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Create gradient for the chart
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(54, 162, 235, 0.7)');
    gradient.addColorStop(1, 'rgba(75, 192, 192, 0.7)');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: title,
                data: data,
                backgroundColor: gradient,
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                borderRadius: 5,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 16
                    }
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Marks (%)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    return canvas.toBuffer('image/png');
}

// Helper function to generate a pie chart
async function generatePieChart(labels, data, title) {
    const width = 500;
    const height = 400;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    const colors = [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
        'rgba(199, 199, 199, 0.7)',
        'rgba(83, 102, 255, 0.7)'
    ];

    const borderColors = [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(199, 199, 199, 1)',
        'rgba(83, 102, 255, 1)'
    ];

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors.slice(0, labels.length),
                borderColor: borderColors.slice(0, labels.length),
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 16
                    }
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });

    return canvas.toBuffer('image/png');
}

// Helper function to generate a doughnut chart
async function generateDoughnutChart(labels, data, title) {
    const width = 500;
    const height = 400;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    const colors = [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)'
    ];

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors.slice(0, labels.length),
                borderColor: '#ffffff',
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 16
                    }
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });

    return canvas.toBuffer('image/png');
}

// Helper function to generate a radar chart
async function generateRadarChart(labels, data, title) {
    const width = 500;
    const height = 400;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: title,
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 16
                    }
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20
                    }
                }
            }
        }
    });

    return canvas.toBuffer('image/png');
}

// Helper function to add a header to each page
function addHeader(doc, pageNumber, totalPages) {
    const originalY = doc.y;
    
    // Add header background
    doc.fillColor('#2c3e50').rect(0, 0, 612, 70).fill();
    
    // Add title
    doc.fillColor('#ffffff')
       .fontSize(16)
       .font('Helvetica-Bold')
       .text('Evaluation Summary Report', 50, 35);
    
    // Add page number
    doc.fillColor('#ecf0f1')
       .fontSize(12)
       .font('Helvetica')
       .text(`Page ${pageNumber} of ${totalPages}`, 500, 35, { align: 'right' });
    
    // Add decorative line
    doc.strokeColor('#3498db').lineWidth(3).moveTo(50, 70).lineTo(550, 70).stroke();
    
    doc.y = originalY;
}

// Helper function to add a footer to each page
function addFooter(doc) {
    const bottomY = 780; // Adjust based on your page size
    
    // Add footer background
    doc.fillColor('#ecf0f1').rect(0, bottomY - 20, 612, 20).fill();
    
    // Add footer text
    doc.fillColor('#7f8c8d')
       .fontSize(9)
       .font('Helvetica-Oblique')
       .text('Confidential - For internal use only', 50, bottomY - 10, {
           align: 'center',
           width: 500
       });
    
    // Add timestamp
    doc.fillColor('#95a5a6')
       .fontSize(8)
       .font('Helvetica')
       .text(`Generated on ${new Date().toLocaleString()}`, 50, bottomY - 25, {
           align: 'right',
           width: 200
       });
}

exports.generateEvaluationSummary = async (evaluatorId) => {
    console.log(`[PDF Generation] Starting PDF generation for evaluator: ${evaluatorId}`);
    
    try {
        // Get all evaluations for evaluator with detailed population
        console.log(`[PDF Generation] Fetching evaluations for evaluator: ${evaluatorId}`);
        
        const evaluations = await Evaluation.find({ evaluator: evaluatorId })
            .populate('criteria', 'code name description')
            .populate('submission', 'title student')
            .populate('submission.student', 'name email')
            .sort({ 'criteria.code': 1, 'evaluationDate': -1 });

        console.log(`[PDF Generation] Found ${evaluations.length} evaluations`);
        
        // Get all criteria assigned to this evaluator
        const User = require('../models/User');
        const user = await User.findById(evaluatorId).populate('assignedCriteria');
        const assignedCriteria = user.assignedCriteria || [];
        
        // Get all student submissions for document tracking
        const StudentSubmission = require('../models/StudentSubmission');
        const allSubmissions = await StudentSubmission.find({ 
            student: { $in: evaluations.map(e => e.submission?.student).filter(Boolean) }
        }).populate('criteria', 'code name');
        
        // Group submissions by criteria
        const submissionsByCriteria = {};
        allSubmissions.forEach(submission => {
            const criteriaId = submission.criteria?._id?.toString();
            if (criteriaId) {
                if (!submissionsByCriteria[criteriaId]) {
                    submissionsByCriteria[criteriaId] = [];
                }
                submissionsByCriteria[criteriaId].push(submission);
            }
        });
        
        // Find missing criteria (assigned but no submissions)
        const missingCriteria = assignedCriteria.filter(criteria => {
            const criteriaId = criteria._id.toString();
            return !submissionsByCriteria[criteriaId] || submissionsByCriteria[criteriaId].length === 0;
        });
        
        if (evaluations.length === 0 && assignedCriteria.length === 0) {
            const error = new Error('No evaluations or assigned criteria found for this evaluator');
            console.error('[PDF Generation] Error:', error.message);
            throw error;
        }

        // Group evaluations by criteria
        const byCriteria = {};
        evaluations.forEach(evalItem => {
            const criteriaId = evalItem.criteria._id.toString();
            if (!byCriteria[criteriaId]) {
                byCriteria[criteriaId] = {
                    criteria: evalItem.criteria,
                    evaluations: []
                };
            }
            byCriteria[criteriaId].evaluations.push(evalItem);
        });

        // Calculate comprehensive statistics
        const allMarks = evaluations.map(e => e.marks).filter(m => m !== undefined);
        const overallStats = {
            totalEvaluations: evaluations.length,
            totalCriteria: Object.keys(byCriteria).length,
            assignedCriteria: assignedCriteria.length,
            missingCriteria: missingCriteria.length,
            totalSubmissions: allSubmissions.length,
            avgMarks: allMarks.length > 0 ? (allMarks.reduce((a, b) => a + b, 0) / allMarks.length).toFixed(2) : 0,
            maxMarks: allMarks.length > 0 ? Math.max(...allMarks) : 0,
            minMarks: allMarks.length > 0 ? Math.min(...allMarks) : 0,
            completionRate: assignedCriteria.length > 0 ? ((assignedCriteria.length - missingCriteria.length) / assignedCriteria.length * 100).toFixed(1) : 0
        };

        // Create a new PDF document with better defaults
        const doc = new PDFDocument({ 
            margin: 50,
            size: 'A4',
            bufferPages: true  // Required for page numbers
        });
        
        // Generate a unique filename with date
        const now = new Date();
        const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        const filename = `evaluation-summary-${formattedDate}.pdf`;
        const filePath = path.join(__dirname, '../reports', filename);
        
        // Ensure reports directory exists
        const reportsDir = path.join(__dirname, '../reports');
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
        }

        // Create a write stream
        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);

        // Track page numbers
        let pageNumber = 1;
        const totalPages = 1; // Will be updated later
        
        // Function to add a new page with header/footer
        const addNewPage = () => {
            doc.addPage();
            pageNumber++;
            addHeader(doc, pageNumber, totalPages);
            doc.moveDown(2);
        };

        // Enhanced Cover Page
        // Add background gradient effect (simulated with rectangles)
        doc.fillColor('#3498db').rect(0, 70, 612, 200).fill();
        doc.fillColor('#2980b9').rect(0, 250, 612, 100).fill();
        
        // Add main title with better styling
        doc.fillColor('#ffffff')
           .fontSize(32)
           .font('Helvetica-Bold')
           .text('EVALUATION SUMMARY REPORT', {
               align: 'center',
               lineGap: 15
           });
        
        doc.moveDown(2);
        doc.fontSize(18)
           .font('Helvetica')
           .text('Comprehensive Performance Analysis', { align: 'center' });
        
        doc.moveDown(3);
        doc.fontSize(14)
           .text(`Generated on: ${now.toLocaleDateString()}`, { align: 'center' });
        
        // Add statistics in a styled box
        const statsY = doc.y;
        doc.fillColor('#ffffff').roundedRect(150, statsY, 312, 120, 10).fill();
        doc.fillColor('#2c3e50').roundedRect(155, statsY + 5, 302, 110, 8).fill();
        
        doc.fillColor('#ffffff')
           .fontSize(12)
           .font('Helvetica-Bold')
           .text('KEY METRICS', 306, statsY + 15, { align: 'center' });
        
        doc.fontSize(11)
           .font('Helvetica')
           .text(`Total Evaluations: ${overallStats.totalEvaluations}`, 306, statsY + 40, { align: 'center' });
        doc.text(`Total Criteria: ${overallStats.totalCriteria}`, 306, statsY + 60, { align: 'center' });
        doc.text(`Overall Average: ${overallStats.avgMarks}%`, 306, statsY + 80, { align: 'center' });
        
        doc.moveDown(8);
        doc.fillColor('#ecf0f1')
           .fontSize(10)
           .font('Helvetica-Oblique')
           .text('Confidential - For internal use only', { align: 'center' });

        // Enhanced Table of Contents
        addNewPage();
        doc.fontSize(18).text('TABLE OF CONTENTS', { align: 'center', underline: true });
        doc.moveDown(2);
        
        // Add TOC items
        doc.fontSize(12).text('1. Executive Summary', { indent: 20 });
        doc.text('2. Document Upload Status', { indent: 20 });
        doc.text('3. Missing Criteria Analysis', { indent: 20 });
        doc.text('4. Criteria-wise Analysis', { indent: 20 });
        
        let tocIndex = 5;
        Object.entries(byCriteria).forEach(([_, { criteria }], idx) => {
            doc.text(`${tocIndex++}. ${criteria.code} - ${criteria.name}`, { indent: 30 });
        });
        
        // Executive Summary
        addNewPage();
        doc.fillColor('#2c3e50')
           .fontSize(20)
           .font('Helvetica-Bold')
           .text('1. EXECUTIVE SUMMARY', { underline: true });
        doc.moveDown();
        
        // Summary statistics with enhanced styling
        doc.fillColor('#34495e')
           .fontSize(16)
           .font('Helvetica-Bold')
           .text('Overall Performance Metrics', { underline: true });
        doc.moveDown(0.5);
        
        // Create a comprehensive summary table
        const summaryTable = {
            headers: ['Metric', 'Value', 'Status'],
            rows: [
                ['Total Evaluations', overallStats.totalEvaluations, overallStats.totalEvaluations > 10 ? 'Excellent' : 'Good'],
                ['Assigned Criteria', overallStats.assignedCriteria, overallStats.assignedCriteria >= 5 ? 'Comprehensive' : 'Standard'],
                ['Evaluated Criteria', overallStats.totalCriteria, overallStats.totalCriteria >= 5 ? 'Excellent' : 'Good'],
                ['Document Uploads', overallStats.totalSubmissions, overallStats.totalSubmissions >= 10 ? 'Excellent' : 'Good'],
                ['Missing Criteria', overallStats.missingCriteria, overallStats.missingCriteria === 0 ? 'Complete' : 'Needs Attention'],
                ['Completion Rate', `${overallStats.completionRate}%`, overallStats.completionRate >= 80 ? 'Excellent' : overallStats.completionRate >= 60 ? 'Good' : 'Needs Improvement'],
                ['Average Marks', `${overallStats.avgMarks}%`, overallStats.avgMarks >= 70 ? 'Above Target' : 'Needs Improvement'],
                ['Highest Score', `${overallStats.maxMarks}%`, overallStats.maxMarks >= 90 ? 'Outstanding' : 'Good'],
                ['Lowest Score', `${overallStats.minMarks}%`, overallStats.minMarks >= 60 ? 'Acceptable' : 'Review Needed']
            ]
        };
        
        // Draw the enhanced summary table
        const startY = doc.y;
        const cellPadding = 8;
        const col1Width = 180;
        const col2Width = 80;
        const col3Width = 120;
        
        // Draw table header with gradient effect
        doc.fillColor('#3498db').rect(50, startY, col1Width, 25).fill();
        doc.fillColor('#3498db').rect(50 + col1Width, startY, col2Width, 25).fill();
        doc.fillColor('#3498db').rect(50 + col1Width + col2Width, startY, col3Width, 25).fill();
        
        doc.fillColor('#ffffff')
           .font('Helvetica-Bold')
           .fontSize(11);
        doc.text(summaryTable.headers[0], 55, startY + 8);
        doc.text(summaryTable.headers[1], 55 + col1Width, startY + 8, { width: col2Width - 10, align: 'center' });
        doc.text(summaryTable.headers[2], 55 + col1Width + col2Width, startY + 8, { width: col3Width - 10, align: 'center' });
        
        // Draw rows with alternating colors
        doc.font('Helvetica').fontSize(10);
        summaryTable.rows.forEach((row, i) => {
            const y = startY + 25 + (i * 22);
            
            // Alternate row colors
            if (i % 2 === 0) {
                doc.fillColor('#f8f9fa').rect(50, y, col1Width + col2Width + col3Width, 22).fill();
            }
            
            // Draw cell borders
            doc.strokeColor('#dee2e6').lineWidth(0.5);
            doc.rect(50, y, col1Width, 22).stroke();
            doc.rect(50 + col1Width, y, col2Width, 22).stroke();
            doc.rect(50 + col1Width + col2Width, y, col3Width, 22).stroke();
            
            // Add text
            doc.fillColor('#2c3e50').text(row[0], 55, y + 6);
            doc.fillColor('#2c3e50').text(row[1], 55 + col1Width, y + 6, { width: col2Width - 10, align: 'center' });
            
            // Color code the status
            const statusColor = row[2].includes('Excellent') || row[2].includes('Outstanding') || row[2].includes('Above Target') || row[2].includes('Comprehensive') ? '#27ae60' :
                             row[2].includes('Good') || row[2].includes('Acceptable') || row[2].includes('Standard') ? '#f39c12' : '#e74c3c';
            doc.fillColor(statusColor).text(row[2], 55 + col1Width + col2Width, y + 6, { width: col3Width - 10, align: 'center' });
        });
        
        doc.moveDown(3);

        // Add comprehensive charts section
        doc.fillColor('#2c3e50')
           .fontSize(16)
           .font('Helvetica-Bold')
           .text('Visual Performance Analysis', { underline: true });
        doc.moveDown();

        try {
            // Generate criteria performance pie chart
            const criteriaLabels = Object.keys(byCriteria).map(key => byCriteria[key].criteria.code);
            const criteriaAverages = Object.keys(byCriteria).map(key => {
                const marks = byCriteria[key].evaluations.map(e => e.marks).filter(m => m !== undefined);
                return marks.length > 0 ? (marks.reduce((a, b) => a + b, 0) / marks.length).toFixed(1) : 0;
            });

            if (criteriaLabels.length > 0) {
                const pieChart = await generatePieChart(criteriaLabels, criteriaAverages, 'Criteria Performance Distribution');
                doc.image(pieChart, 50, doc.y, { width: 250 });
                
                // Generate grade distribution doughnut chart
                const gradeRanges = {
                    'Excellent (90-100%)': 0,
                    'Good (75-89%)': 0,
                    'Average (60-74%)': 0,
                    'Below Average (<60%)': 0
                };
                
                allMarks.forEach(mark => {
                    if (mark >= 90) gradeRanges['Excellent (90-100%)']++;
                    else if (mark >= 75) gradeRanges['Good (75-89%)']++;
                    else if (mark >= 60) gradeRanges['Average (60-74%)']++;
                    else gradeRanges['Below Average (<60%)']++;
                });
                
                const doughnutChart = await generateDoughnutChart(
                    Object.keys(gradeRanges), 
                    Object.values(gradeRanges), 
                    'Grade Distribution'
                );
                doc.image(doughnutChart, 320, doc.y - 180, { width: 250 });
                
                doc.moveDown(12);
                
                // Generate radar chart for criteria comparison
                if (criteriaLabels.length >= 3) {
                    const radarChart = await generateRadarChart(criteriaLabels, criteriaAverages, 'Criteria Performance Radar');
                    doc.image(radarChart, 180, doc.y, { width: 250 });
                    doc.moveDown(10);
                }
            }
        } catch (error) {
            console.error('Error generating charts:', error);
            doc.text('Charts generation failed', { indent: 20 });
        }
        
        doc.moveDown(2);
        
        // Enhanced Criteria-wise Analysis
        doc.addPage();
        doc.fillColor('#2c3e50')
           .fontSize(20)
           .font('Helvetica-Bold')
           .text('2. CRITERIA-WISE ANALYSIS', { underline: true });
        doc.moveDown();
        
        // Process each criteria with enhanced styling
        for (const [criteriaId, data] of Object.entries(byCriteria)) {
            const { criteria, evaluations } = data;
            const marks = evaluations.map(e => e.marks).filter(m => m !== undefined);
            const avgMarks = marks.length > 0 ? (marks.reduce((a, b) => a + b, 0) / marks.length).toFixed(2) : 'N/A';
            const maxMarks = marks.length > 0 ? Math.max(...marks) : 'N/A';
            const minMarks = marks.length > 0 ? Math.min(...marks) : 'N/A';
            
            // Check if we need a new page
            if (doc.y > 600) {
                addNewPage();
            } else {
                doc.moveDown();
            }
            
            // Add criteria header with background
            const headerY = doc.y;
            doc.fillColor('#3498db').roundedRect(50, headerY, 500, 35, 5).fill();
            doc.fillColor('#ffffff')
               .fontSize(14)
               .font('Helvetica-Bold')
               .text(`${criteria.code} - ${criteria.name}`, 60, headerY + 12);
            
            doc.moveDown(2);
            
            if (criteria.description) {
                doc.fillColor('#7f8c8d')
                   .fontSize(10)
                   .font('Helvetica-Oblique')
                   .text(criteria.description, {
                       paragraphGap: 5,
                       indent: 10
                   });
                doc.moveDown();
            }
            
            // Create criteria stats box
            const statsY = doc.y;
            doc.fillColor('#ecf0f1').roundedRect(60, statsY, 480, 80, 5).fill();
            doc.fillColor('#bdc3c7').roundedRect(65, statsY + 5, 470, 70, 3).fill();
            
            doc.fillColor('#2c3e50')
               .fontSize(11)
               .font('Helvetica-Bold')
               .text('Performance Statistics', 75, statsY + 15);
            
            // Add stats in columns
            doc.fontSize(10).font('Helvetica');
            doc.text(`Total Evaluations: ${evaluations.length}`, 75, statsY + 35);
            doc.text(`Average Marks: ${avgMarks}%`, 75, statsY + 50);
            doc.text(`Highest Marks: ${maxMarks}%`, 250, statsY + 35);
            doc.text(`Lowest Marks: ${minMarks}%`, 250, statsY + 50);
            
            // Performance indicator
            const performanceColor = avgMarks >= 80 ? '#27ae60' : avgMarks >= 60 ? '#f39c12' : '#e74c3c';
            const performanceText = avgMarks >= 80 ? 'Excellent' : avgMarks >= 60 ? 'Good' : 'Needs Improvement';
            doc.fillColor(performanceColor)
               .font('Helvetica-Bold')
               .text(`Performance: ${performanceText}`, 420, statsY + 42);
            
            doc.moveDown(4);
            
            // Add individual chart for this criteria
            if (marks.length > 1) {
                try {
                    const chartData = evaluations.map(e => ({
                        label: e.submission ? e.submission.student?.name || 'Unknown' : 'General',
                        value: e.marks || 0,
                        date: e.evaluationDate
                    }));
                    
                    // Sort by date
                    chartData.sort((a, b) => new Date(a.date) - new Date(b.date));
                    
                    // Generate bar chart for this criteria
                    const barChart = await generateBarChart(
                        chartData.map((d, i) => `Eval ${i + 1}`),
                        chartData.map(d => d.value),
                        `${criteria.code} Performance Trend`
                    );
                    
                    // Add chart to PDF
                    const chartY = doc.y;
                    doc.image(barChart, 60, chartY, { width: 480 });
                    doc.y = chartY + 220;
                    
                    // Add mini pie chart for grade distribution in this criteria
                    const gradeRanges = {
                        'Excellent': 0,
                        'Good': 0,
                        'Average': 0,
                        'Poor': 0
                    };
                    
                    marks.forEach(mark => {
                        if (mark >= 90) gradeRanges['Excellent']++;
                        else if (mark >= 75) gradeRanges['Good']++;
                        else if (mark >= 60) gradeRanges['Average']++;
                        else gradeRanges['Poor']++;
                    });
                    
                    const hasGrades = Object.values(gradeRanges).some(count => count > 0);
                    if (hasGrades) {
                        const miniPieChart = await generatePieChart(
                            Object.keys(gradeRanges).filter(key => gradeRanges[key] > 0),
                            Object.values(gradeRanges).filter(count => count > 0),
                            `${criteria.code} Grade Distribution`
                        );
                        
                        doc.image(miniPieChart, 200, doc.y, { width: 200 });
                        doc.y += 180;
                    }
                } catch (error) {
                    console.error('Error generating chart:', error);
                    doc.fillColor('#e74c3c')
                       .fontSize(10)
                       .text('Chart generation skipped for this criteria', { indent: 20 });
                }
            } else {
                doc.fillColor('#95a5a6')
                   .fontSize(10)
                   .font('Helvetica-Oblique')
                   .text('Insufficient data for chart generation', { indent: 20 });
                doc.moveDown(2);
                addNewPage();
            }
        
        } // Close the for loop for processing criteria
        
        // Add final page with summary
        addNewPage();
        doc.fontSize(18).text('REPORT SUMMARY', { align: 'center', underline: true });
        doc.moveDown(2);
        
        doc.fontSize(12).text('This report contains a comprehensive analysis of all evaluations conducted.', {
            align: 'center',
            width: 500
        });
        
        doc.moveDown();
        doc.text(`Total Evaluations: ${overallStats.totalEvaluations}`, { align: 'center' });
        doc.text(`Average Score: ${overallStats.avgMarks}%`, { align: 'center' });
        
        doc.moveDown(3);
        doc.text('--- End of Report ---', { align: 'center' });
        
        // Finalize the PDF
        doc.end();

        // Return a promise that resolves when the PDF is fully written
        return new Promise((resolve, reject) => {
            writeStream.on('finish', () => resolve({
                filename,
                path: filePath
            }));
            writeStream.on('error', reject);
        });
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    }
};

// Route handler for generating evaluation summary
exports.getEvaluationSummaryPDF = async (req, res) => {
    let filePath;
    
    try {
        console.log('PDF Generation - Starting...');
        
        if (!req.user || !req.user._id) {
            console.error('PDF Generation - Unauthorized: No user or user ID found');
            return res.status(401).json({ message: 'Authentication required' });
        }

        console.log(`PDF Generation - User ID: ${req.user._id}`);
        
        // Generate the PDF
        const result = await exports.generateEvaluationSummary(req.user._id);
        
        if (!result || !result.filename || !result.path) {
            throw new Error('Failed to generate PDF: Invalid result from generateEvaluationSummary');
        }
        
        filePath = result.path;
        const filename = result.filename;
        
        console.log(`PDF Generation - PDF generated at: ${filePath}`);
        
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            throw new Error(`Generated PDF file not found at: ${filePath}`);
        }
        
        // Get file stats
        const stats = fs.statSync(filePath);
        if (stats.size === 0) {
            throw new Error('Generated PDF file is empty');
        }
        
        console.log(`PDF Generation - File size: ${stats.size} bytes`);
        
        // Set headers for file download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Length', stats.size);
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        
        // Stream the file
        const fileStream = fs.createReadStream(filePath);
        
        fileStream.on('error', (error) => {
            console.error('Error reading PDF file:', error);
            if (!res.headersSent) {
                res.status(500).json({ 
                    message: 'Error reading generated PDF', 
                    error: error.message 
                });
            }
        });
        
        fileStream.pipe(res);
        
        // Delete the file after streaming
        fileStream.on('end', () => {
            console.log('PDF Generation - File sent successfully, cleaning up...');
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting temporary PDF file:', err);
                } else {
                    console.log('PDF Generation - Temporary file deleted');
                }
            });
        });
        
    } catch (error) {
        console.error('Error in getEvaluationSummaryPDF:', error);
        
        // Clean up the file if it was created
        if (filePath && fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) console.error('Error cleaning up failed PDF file:', err);
            });
        }
        
        if (!res.headersSent) {
            res.status(500).json({ 
                message: 'Error generating evaluation summary', 
                error: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    }
};
