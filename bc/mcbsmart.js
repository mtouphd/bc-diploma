'use strict';

const { Contract } = require('fabric-contract-api');

class TeacherPromotionContract extends Contract {

    /**
     * Vérifier l'éligibilité d'un enseignant pour la promotion au grade de MCA.
     */
    async checkPromotionEligibility(ctx, teacherId, experienceYears, phdSupervisions, publications, conferences) {
        // Vérifie si l'enseignant a au moins 3 ans d'expérience
        if (experienceYears < 3) {
            throw new Error(`L'enseignant ${teacherId} n'a pas les 3 ans d'expérience requis.`);
        }

        // Vérifie si l'enseignant a encadré au moins 10 doctorants ayant publié
        if (phdSupervisions < 10) {
            throw new Error(`L'enseignant ${teacherId} n'a pas encadré 10 doctorants ayant publié.`);
        }

        // Vérifie si l'enseignant a au moins 10 publications scientifiques
        if (publications.length < 10) {
            throw new Error(`L'enseignant ${teacherId} n'a pas 10 publications scientifiques.`);
        }

        // Vérifie si l'enseignant a participé à au moins 10 journées ou séminaires
        if (conferences < 10) {
            throw new Error(`L'enseignant ${teacherId} n'a pas participé à 10 journées ou séminaires.`);
        }

        return `L'enseignant ${teacherId} est éligible à la promotion au grade de MCA.`;
    }
}

module.exports = TeacherPromotionContract; // Exporte le smart contract
