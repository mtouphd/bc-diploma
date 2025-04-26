/**
 * Smart Contract pour la gestion des diplômes des étudiants en Licence et Master.
 * - Vérifie si l'étudiant a validé les années requises avec au moins 10 de moyenne annuelle.
 * - Vérifie si l'étudiant possède une licence avant d'accéder au Master.
 * - Enregistre le hash du mémoire PDF soumis par l'étudiant.
 * - Pour le Master, un stage doit également être validé et une soutenance notée à 10 minimum.
 * - Permet aux enseignants de valider ou refuser le mémoire et le stage.
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class DiplomaContract extends Contract {

    /**
     * Initialisation du ledger (optionnel)
     */
    async initLedger(ctx) {
        console.info('Smart contract initialized'); // Affiche un message lors de l'initialisation
    }

    /**
     * Vérifier si un étudiant est éligible au diplôme (Licence ou Master)
     */
    async checkEligibility(ctx, studentId, level, licenseCode, ...years) {
        if (level === 'Master' && (!licenseCode || licenseCode.trim() === '')) {
            throw new Error(`L'étudiant ${studentId} doit entrer un code de licence valide pour accéder au Master.`);
        }
        
        if (years.some(year => year < 10)) { // Vérifie si une des années a une moyenne inférieure à 10
            throw new Error(`L'étudiant ${studentId} n'a pas validé toutes les années requises.`);
        }
        return `L'étudiant ${studentId} est éligible pour le diplôme de ${level}.`; // Retourne un message confirmant l'éligibilité
    }

    /**
     * Soumission du mémoire et du stage par l'étudiant (Master uniquement)
     */
    async submitThesisAndInternship(ctx, studentId, thesisHash, internshipHash) {
        const student = await ctx.stub.getState(studentId); // Récupère les données de l'étudiant
        if (!student || student.length === 0) { // Vérifie si l'étudiant existe
            throw new Error(`L'étudiant ${studentId} n'existe pas.`);
        }
        
        const studentData = JSON.parse(student.toString()); // Convertit les données en JSON
        if (studentData.thesisValidated) { // Vérifie si le mémoire a déjà été validé
            throw new Error(`Le mémoire de l'étudiant ${studentId} a déjà été validé, modification impossible.`);
        }

        studentData.thesisHash = thesisHash; // Stocke le hash du mémoire
        studentData.internshipHash = internshipHash; // Stocke le hash du stage
        studentData.thesisValidated = false; // En attente de validation
        studentData.internshipValidated = false; // En attente de validation

        await ctx.stub.putState(studentId, Buffer.from(JSON.stringify(studentData))); // Enregistre les données mises à jour
        return `Mémoire et stage soumis pour l'étudiant ${studentId}.`; // Confirme la soumission
    }

    /**
     * Validation ou refus du mémoire et du stage par l'enseignant (Master)
     */
    async validateThesisAndInternship(ctx, studentId, thesisDecision, internshipDecision, defenseGrade) {
        const student = await ctx.stub.getState(studentId); // Récupère les données de l'étudiant
        if (!student || student.length === 0) { // Vérifie si l'étudiant existe
            throw new Error(`L'étudiant ${studentId} n'existe pas.`);
        }

        const studentData = JSON.parse(student.toString()); // Convertit les données en JSON
        if (!studentData.thesisHash || !studentData.internshipHash) { // Vérifie si le mémoire et le stage ont été soumis
            throw new Error(`Mémoire ou stage non soumis pour l'étudiant ${studentId}.`);
        }

        if (!['accept', 'reject'].includes(thesisDecision) || !['accept', 'reject'].includes(internshipDecision)) { // Vérifie que les décisions sont valides
            throw new Error(`Décision invalide. Utiliser 'accept' ou 'reject'.`);
        }

        if (defenseGrade < 10) { // Vérifie si la note de soutenance est suffisante
            throw new Error(`L'étudiant ${studentId} a obtenu une note de soutenance insuffisante (${defenseGrade}).`);
        }

        studentData.thesisValidated = (thesisDecision === 'accept'); // Met à jour le statut de validation du mémoire
        studentData.internshipValidated = (internshipDecision === 'accept'); // Met à jour le statut de validation du stage
        studentData.defenseGrade = defenseGrade; // Enregistre la note de soutenance
        studentData.validationDate = new Date().toISOString(); // Enregistre la date de validation

        await ctx.stub.putState(studentId, Buffer.from(JSON.stringify(studentData))); // Sauvegarde les mises à jour
        return `Mémoire ${thesisDecision === 'accept' ? 'validé' : 'refusé'}, stage ${internshipDecision === 'accept' ? 'validé' : 'refusé'}, note de soutenance ${defenseGrade} pour l'étudiant ${studentId}.`;
    }
}

module.exports = DiplomaContract; // Exporte le smart contract pour l'utilisation dans Hyperledger Fabric
