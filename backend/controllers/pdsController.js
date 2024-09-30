const fillExcelTemplate = require('../utils/fillExcelTemplate');
const libre = require('libreoffice-convert');
const ExcelJS = require('exceljs');
const fs = require('fs-extra');
const path = require('path');
const { PDFDocument } = require('pdf-lib');
const BasicDetails = require('../models/basicDetailsModel');
const PersonalDetails = require('../models/personalDetailsModel');
const ContactDetails = require('../models/contactDetailsModel');
const FamilyBackground = require('../models/familybackgroundModel');
const ChildrenDetails = require('../models/childrenModel');
const EducationDetails = require('../models/educationModel');
const CivilServiceEligibility = require('../models/CivilServiceEligibility');
const WorkExperience = require('../models/workexperienceModel');
const VoluntaryWork = require('../models/voluntaryworkModel');
const LearningDevelopment = require('../models/learningdevelopmentModel');
const SpecialSkill = require('../models/specialSkillModel');
const NonAcademic = require('../models/nonAcademicModel');
const Membership = require('../models/membershipModel');
const CharacterReference = require('../models/characterReferenceModel');
const AdditionalQuestions = require('../models/additionalQuestionModel');

exports.generatePDS = async (req, res) => {
    let tempExcelFilePath = null;
    let testPdfPath = null;
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(400).json({ message: 'Invalid userId from JWT' });
        }

        const basicDetails = await BasicDetails.findOne({ where: { UserID: userId } });
        const personalDetails = await PersonalDetails.findOne({ where: { UserID: userId } });
        const contactDetails = await ContactDetails.findOne({ where: { UserID: userId } });
        const familyBackground = await FamilyBackground.findOne({ where: { UserID: userId } });
        const childrenDetails = await ChildrenDetails.findAll({ where: { UserID: userId } });
        const educationDetails = await EducationDetails.findAll({ where: { UserID: userId } });
        const civilServiceEligibilities = await CivilServiceEligibility.findAll({ where: { UserID: userId } });
        const workExperiences = await WorkExperience.findAll({ where: { UserID: userId } });
        const voluntaryWorks = await VoluntaryWork.findAll({ 
            where: { UserID: userId },
            raw: true
        });
        const learningDevelopments = await LearningDevelopment.findAll({ where: { UserID: userId } });
        const specialSkills = await SpecialSkill.findAll({ where: { UserID: userId } });
        const nonAcademics = await NonAcademic.findAll({ where: { UserID: userId } });
        const memberships = await Membership.findAll({ where: { UserID: userId } });
        const characterReferences = await CharacterReference.findAll({ where: { UserID: userId } });
        const additionalQuestions = await AdditionalQuestions.findOne({ where: { UserID: userId } });
        console.log("Fetched Voluntary Works:", JSON.stringify(voluntaryWorks, null, 2));

        if (!basicDetails || 
            !personalDetails || 
            !contactDetails || 
            !familyBackground || 
            !childrenDetails || 
            !educationDetails || 
            !civilServiceEligibilities || 
            !workExperiences || 
            !voluntaryWorks || 
            !learningDevelopments ||
            !specialSkills ||
            !nonAcademics ||
            !memberships ||
            !characterReferences ||
            !additionalQuestions
        ) {
            return res.status(404).json({ message: 'User details not found' });
        }

        const userDetails = {
            ...basicDetails.get({ plain: true }),
            ...personalDetails.get({ plain: true }),
            ...contactDetails.get({ plain: true }),
            ...familyBackground.get({ plain: true }),
        };

        tempExcelFilePath = await fillExcelTemplate(userDetails, 
            childrenDetails, 
            educationDetails, 
            civilServiceEligibilities, 
            workExperiences, 
            voluntaryWorks, 
            learningDevelopments,
            specialSkills,
            nonAcademics,
            memberships,
            characterReferences,
            additionalQuestions
        );
        const pdfBuffer = await convertExcelToPDF(tempExcelFilePath);
        console.log('Original PDF Buffer size:', pdfBuffer.length);

        const finalPdfBuffer = await removeSecondPageFromPDF(pdfBuffer);
        console.log('Final PDF Buffer size:', finalPdfBuffer.length);

        testPdfPath = path.join(__dirname, '../temp/test.pdf');
        await fs.writeFile(testPdfPath, finalPdfBuffer);
        console.log('PDF saved to test.pdf for manual verification');

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename=pds_form.pdf');
        res.setHeader('Content-Length', finalPdfBuffer.length);
        res.end(finalPdfBuffer);

        console.log('PDS sent successfully');
    } catch (error) {
        console.error('Error generating PDS:', error);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Error generating PDS', error: error.message });
        }
    } finally {
        try {
            if (tempExcelFilePath) await fs.remove(tempExcelFilePath);
            if (testPdfPath) await fs.remove(testPdfPath);
            console.log('Temporary files cleaned up');
        } catch (cleanupError) {
            console.error('Error during cleanup:', cleanupError);
        }
    }
};

exports.generatePDSForUser = async (req, res) => {
    let tempExcelFilePath = null;
    let testPdfPath = null;
    try {
        const { userId } = req.params;

        const basicDetails = await BasicDetails.findOne({ where: { UserID: userId } });
        const personalDetails = await PersonalDetails.findOne({ where: { UserID: userId } });
        const contactDetails = await ContactDetails.findOne({ where: { UserID: userId } });
        const familyBackground = await FamilyBackground.findOne({ where: { UserID: userId } });
        const childrenDetails = await ChildrenDetails.findAll({ where: { UserID: userId } });
        const educationDetails = await EducationDetails.findAll({ where: { UserID: userId } });
        const civilServiceEligibilities = await CivilServiceEligibility.findAll({ where: { UserID: userId } });
        const workExperiences = await WorkExperience.findAll({ where: { UserID: userId } });
        const voluntaryWorks = await VoluntaryWork.findAll({ 
            where: { UserID: userId },
            raw: true
        });
        const learningDevelopments = await LearningDevelopment.findAll({ where: { UserID: userId } });
        const specialSkills = await SpecialSkill.findAll({ where: { UserID: userId } });
        const nonAcademics = await NonAcademic.findAll({ where: { UserID: userId } });
        const memberships = await Membership.findAll({ where: { UserID: userId } });
        const characterReferences = await CharacterReference.findAll({ where: { UserID: userId } });
        const additionalQuestions = await AdditionalQuestions.findOne({ where: { UserID: userId } });

        if (!basicDetails || 
            !personalDetails || 
            !contactDetails || 
            !familyBackground || 
            !childrenDetails || 
            !educationDetails || 
            !civilServiceEligibilities || 
            !workExperiences || 
            !voluntaryWorks || 
            !learningDevelopments || 
            !specialSkills || 
            !nonAcademics || 
            !memberships ||
            !characterReferences ||
            !additionalQuestions
        ) {
            return res.status(400).json({ message: 'Some user details are missing. Please complete the profile before generating the PDS.' });
        }

        console.log('PDS generation started for user:', userId);

        const userDetails = {
            ...basicDetails.get({ plain: true }),
            ...personalDetails.get({ plain: true }),
            ...contactDetails.get({ plain: true }),
            ...familyBackground.get({ plain: true }),
        };

        tempExcelFilePath = await fillExcelTemplate(userDetails, 
            childrenDetails, 
            educationDetails, 
            civilServiceEligibilities, 
            workExperiences, 
            voluntaryWorks, 
            learningDevelopments,
            specialSkills,
            nonAcademics,
            memberships,
            characterReferences,
            additionalQuestions
        );
        const pdfBuffer = await convertExcelToPDF(tempExcelFilePath);
        console.log('Original PDF Buffer size:', pdfBuffer.length);

        const finalPdfBuffer = await removeSecondPageFromPDF(pdfBuffer);
        console.log('Final PDF Buffer size:', finalPdfBuffer.length);

        testPdfPath = path.join(__dirname, `../temp/test_pds_${userId}.pdf`);
        await fs.writeFile(testPdfPath, finalPdfBuffer);
        console.log(`PDF saved to ${testPdfPath} for manual verification`);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename=pds_form.pdf');
        res.setHeader('Content-Length', finalPdfBuffer.length);
        res.end(finalPdfBuffer);

        console.log('PDS generation successful for user:', userId);
    } catch (error) {
        console.error('Error generating PDS:', error);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Error generating PDS', error: error.message });
        }
    } finally {
        try {
            if (tempExcelFilePath) await fs.remove(tempExcelFilePath);
            if (testPdfPath) await fs.remove(testPdfPath);
            console.log('Temporary files cleaned up');
        } catch (cleanupError) {
            console.error('Error during cleanup:', cleanupError);
        }
    }
};

async function convertExcelToPDF(excelFilePath) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(excelFilePath);

    const worksheet = workbook.getWorksheet(1);

    worksheet.pageSetup.paperSize = 5;
    worksheet.pageSetup.orientation = 'portrait';
    worksheet.pageSetup.fitToPage = false;
    worksheet.pageSetup.scale = 80;

    worksheet.pageSetup.margins = {
        top: 0.3,
        left: 0.0,
        right: 0.0,
        bottom: 0.0,
        header: 0.0,
        footer: 0.0,
    };

    worksheet.pageSetup.printArea = 'A1:N61';

    worksheet.views = [{ showGridLines: false }];

    const updatedFilePath = path.join(__dirname, '../temp/updated_filled_pds.xlsx');
    await workbook.xlsx.writeFile(updatedFilePath);

    const buffer = await fs.readFile(updatedFilePath);
    return new Promise((resolve, reject) => {
        libre.convert(buffer, '.pdf', undefined, (err, pdfBuffer) => {
            if (err) {
                return reject(err);
            }
            resolve(pdfBuffer);
        });
    });
}

async function removeSecondPageFromPDF(pdfBuffer) {
    try {
        const pdfDoc = await PDFDocument.load(pdfBuffer);
        const totalPages = pdfDoc.getPageCount();

        console.log('Total pages in PDF:', totalPages);

        if (totalPages > 1) {
            pdfDoc.removePage(1);
            console.log('Second page removed');
        } else {
            console.log('PDF has only one page, no removal needed');
        }

        const modifiedPdfBuffer = await pdfDoc.save({ useObjectStreams: false });

        console.log('Total pages in modified PDF:', pdfDoc.getPageCount());
        console.log('Modified PDF buffer size:', modifiedPdfBuffer.length);

        return modifiedPdfBuffer;
    } catch (error) {
        console.error('Error removing second page from PDF:', error);
        throw error;
    }
}