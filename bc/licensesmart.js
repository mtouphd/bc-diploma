/**
 * Smart Contract pour la gestion des diplômes des étudiants en Licence.
 * - Vérifie si l'étudiant a validé les trois années avec au moins 10 de moyenne annuelle.
 * - Enregistre le hash du mémoire PDF soumis par l'étudiant.
 * - Permet aux enseignants de valider ou refuser le mémoire.
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class DiplomaContract extends Contract {

    /**
     * Initialisation du ledger (optionnel)
     */
    async initLedger(ctx) {
        console.info('Smart contract initialized');
    }

    /**
     * Vérifier si un étudiant est éligible au diplôme
     */
    async checkEligibility(ctx, studentId, year1, year2, year3) {
        if (year1 <= 10 || year2 <= 10 || year3 <= 10) {
            throw new Error(`L'étudiant ${studentId} n'a pas validé toutes les années.`);
        }
        return `L'étudiant ${studentId} est éligible pour le diplôme.`;
    }

    /**
     * Soumission du mémoire par l'étudiant (enregistrement du hash)
     */
    async submitThesis(ctx, studentId, thesisHash) {
        const student = await ctx.stub.getState(studentId);
        if (!student || student.length === 0) {
            throw new Error(`L'étudiant ${studentId} n'existe pas.`);
        }
        
        const studentData = JSON.parse(student.toString());
        if (studentData.thesisValidated) {
            throw new Error(`Le mémoire de l'étudiant ${studentId} a déjà été validé, modification impossible.`);
        }

        studentData.thesisHash = thesisHash;
        studentData.thesisValidated = false; // En attente de validation

        await ctx.stub.putState(studentId, Buffer.from(JSON.stringify(studentData)));
        return `Mémoire soumis pour l'étudiant ${studentId}.`;
    }

    /**
     * Validation ou refus du mémoire par l'enseignant
     */
    async validateThesis(ctx, studentId, decision) {
        const student = await ctx.stub.getState(studentId);
        if (!student || student.length === 0) {
            throw new Error(`L'étudiant ${studentId} n'existe pas.`);
        }

        const studentData = JSON.parse(student.toString());
        if (!studentData.thesisHash) {
            throw new Error(`Aucun mémoire soumis pour l'étudiant ${studentId}.`);
        }

        if (decision !== 'accept' && decision !== 'reject') {
            throw new Error(`Décision invalide. Utiliser 'accept' ou 'reject'.`);
        }

        studentData.thesisValidated = (decision === 'accept');
        studentData.validationDate = new Date().toISOString();

        await ctx.stub.putState(studentId, Buffer.from(JSON.stringify(studentData)));
        return `Mémoire de l'étudiant ${studentId} ${decision === 'accept' ? 'validé' : 'refusé'}.`;
    }
}

module.exports = DiplomaContract;
