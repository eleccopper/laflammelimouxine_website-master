import React from "react";
import PageHeading from "../PageHeading";
import Spacing from "../Spacing";
import Div from "../Div";

export default function LegalNotice() {
  return (
    <>
      <Spacing lg="150" md="80" />
      <Div className="container">
        <Div className="row">
          <Div className="col-lg-12">
            <h2>Mentions Légales</h2>
            <p><strong>1. Présentation de l'entreprise</strong></p>
            <p>Raison sociale : LA FLAMME LIMOUXINE</p>
            <p>Forme juridique : Société par actions simplifiée (SAS)</p>
            <p>Capital social : 2 000 euros</p>
            <p>Siège social : 27 chemin de la Plaine, 11250 Rouffiac-d'Aude</p>
            <p>Numéro SIREN : 902 152 917</p>
            <p>Numéro de TVA intracommunautaire : FR71 902152917</p>
            <p>Code NAF/APE : 4322B (Travaux d'installation d'équipements thermiques et de climatisation)</p>

            <p><strong>2. Responsable de la publication</strong></p>
            <p>Nom : M. Charles Liégeois</p>
            <p>Fonction : Président</p>

            <p><strong>3. Hébergement du site</strong></p>
            <p>Hébergeur : OVH</p>
            <p>Adresse : 140 Quai du Sartel, 59100 Roubaix, France</p>
            <p>Téléphone : 08 203 203 63</p>

            <p><strong>4. Conception et réalisation du site</strong></p>
            <p>Développeur : Tristan Navez</p>
            <p>SIREN : 954 036 513</p>
            <p>Github : https://github.com/tristannavez</p>
            <p>Website : https://tristannavez.fr</p>

            <p><strong>5. Propriété intellectuelle</strong></p>
            <p>Le site ainsi que son contenu sont protégés par les dispositions du Code de la propriété intellectuelle.</p>
            
            <p><strong>6. Données personnelles</strong></p>
            <p>Les informations recueillies via le formulaire de contact sont enregistrées et transmises aux services concernés.</p>
            <p>Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant.</p>
            <p>Contact : 27 chemin de la Plaine, 11250 Rouffiac-d'Aude | Téléphone : 04 68 20 07 05 | Email : contact@laflammelimouxine.fr</p>

            <p><strong>7. Limitations de responsabilité</strong></p>
            <p>La Flamme Limouxine s'efforce d'assurer l'exactitude des informations diffusées sur le site.</p>
            
            <p><strong>8. Droit applicable</strong></p>
            <p>Les présentes mentions légales sont régies par le droit français.</p>
          </Div>
        </Div>
      </Div>
      <Spacing lg="150" md="80" />
    </>
  );
}
