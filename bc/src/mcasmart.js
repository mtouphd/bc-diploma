/**
 * Smart Contract pour la promotion de MCA à Professeur.
 * - Vérifie si l'enseignant a l'expérience requise.
 * - Vérifie les encadrements de doctorants avec publications.
 * - Vérifie les publications scientifiques et les séminaires.
 * - Si toutes les conditions sont remplies, l'enseignant est promu au grade de Professeur.
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class ProfessorPromotionContract extends Contract {

    /**
     * Vérifier si un enseignant est éligible à la promotion de MCA à Professeur
     */
    async checkEligibilityMCAtoProf(ctx, teacherId, yearsExperience, phdSupervisions, publications, seminars) {
        if (yearsExperience < 5) {
            throw new Error(`L'enseignant ${teacherId} n'a pas assez d'années d'expérience (minimum 5 ans requis).`);
        }
        if (phdSupervisions < 10) {
            throw new Error(`L'enseignant ${teacherId} n'a pas encadré suffisamment de doctorants avec publications (minimum 10 requis).`);
        }
        if (publications.length < 10) {
            throw new Error(`L'enseignant ${teacherId} n'a pas publié assez d'articles scientifiques (minimum 10 requis).`);
        }
        if (seminars < 10) {
            throw new Error(`L'enseignant ${teacherId} n'a pas participé à assez de séminaires (minimum 10 requis).`);
        }
        return `L'enseignant ${teacherId} est éligible pour la promotion au grade de Professeur.`;
    }
}

module.exports = ProfessorPromotionContract; // Exporte le smart contract pour l'utilisation dans Hyperledger Fabric
