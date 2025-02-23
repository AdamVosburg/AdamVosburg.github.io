const MedicalRecordService = require('../services/medicalRecord.service.js');
const catchAsync = require('../utils/catchAsync.js');

class MedicalRecordController {
  // Create a new medical record
  static createMedicalRecord = catchAsync(async (req, res) => {
    const recordData = req.body;
    const medicalRecord = await MedicalRecordService.createMedicalRecord(recordData);

    res.status(201).json({
      status: 'success',
      data: medicalRecord
    });
  });

  // Get medical record by ID
  static getMedicalRecordById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const medicalRecord = await MedicalRecordService.getMedicalRecordById(id);

    res.status(200).json({
      status: 'success',
      data: medicalRecord
    });
  });

  // Add exam record
  static addExamRecord = catchAsync(async (req, res) => {
    const examData = req.body;
    const medicalRecord = await MedicalRecordService.addExamRecord(examData);

    res.status(201).json({
      status: 'success',
      data: medicalRecord
    });
  });

  // Add vaccination record
  static addVaccination = catchAsync(async (req, res) => {
    const vaccinationData = req.body;
    const medicalRecord = await MedicalRecordService.addVaccination(vaccinationData);

    res.status(201).json({
      status: 'success',
      data: medicalRecord
    });
  });

  // Add medication to medical record
  static addMedication = catchAsync(async (req, res) => {
    const { recordId } = req.params;
    const medicationData = req.body;
    const medication = await MedicalRecordService.addMedication(recordId, medicationData);

    res.status(201).json({
      status: 'success',
      data: medication
    });
  });

  // Get medical records for an animal
  static getMedicalRecordsByAnimal = catchAsync(async (req, res) => {
    const { animalId } = req.params;
    const medicalRecords = await MedicalRecordService.getMedicalRecordsByAnimal(animalId);

    res.status(200).json({
      status: 'success',
      results: medicalRecords.length,
      data: medicalRecords
    });
  });

  // Generate comprehensive medical report
  static generateMedicalReport = catchAsync(async (req, res) => {
    const { animalId } = req.params;
    const medicalReport = await MedicalRecordService.generateMedicalReport(animalId);

    res.status(200).json({
      status: 'success',
      data: medicalReport
    });
  });

  // Update follow-up status for a medical record
  static updateFollowUpStatus = catchAsync(async (req, res) => {
    const { recordId } = req.params;
    const updatedRecord = await MedicalRecordService.updateFollowUpStatus(recordId);

    res.status(200).json({
      status: 'success',
      data: updatedRecord
    });
  });
}

module.exports = MedicalRecordController;