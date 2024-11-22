interface Demande {
  _id: string;
  fullname: string;
  birthdate: Date;
  phone: string;
  gender: "male" | "female" | "other";
  address: string;
  projectName: string;
  projectObjectifs?: string;
  projectCompetitors?: string;
  coordinates?: string;
  features?: string;
  target?: string;
  createdAt: string;
}

export default Demande;
