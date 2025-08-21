import { collection, doc, getDoc, getDocs, writeBatch, increment } from 'firebase/firestore';
import { db } from '../db/FirebaseConfig';

export async function archiveMonthlyLeaderboard() {
    try {
        const summaryCollectionRef = collection(db, 'userlist');
        const snapshot = await getDocs(summaryCollectionRef);

        const allUsers = [];
        const summaryDocs = [];

        snapshot.forEach((docSnap) => {
            if (docSnap.id !== '_meta') {
                const data = docSnap.data();
                const users = data.users || [];
                summaryDocs.push({ id: docSnap.id, users });
                allUsers.push(...users);
            }
        });
        
        
        allUsers.sort((a, b) => b.points - a.points);

        const top10 = allUsers.slice(0, 10).map((user, index) => ({
            ...user,
            position: index + 1,
            paid: false,
        }));;
        const now = new Date();
        const monthYear = `${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;

        const winnersRef = doc(db, 'winners', monthYear);
        const winnersData = {
            createdAt: now,
            winners: top10,
        };


        const updatedDocs = summaryDocs.map(({ id, users }) => {
            const updatedUsers = users.map((u) => {
                const index = allUsers.findIndex((a) => a.user_id === u.user_id);
                const currentPoints = allUsers[index]?.points || 0;
                return {
                    ...u,
                    last_month_points: currentPoints,
                    last_month_position: index + 1,
                    points: 0,
                };
            });
            return { id, users: updatedUsers };
        });

        const batchLimit = 500;
        for (let i = 0; i < updatedDocs.length; i += batchLimit) {
            const batch = writeBatch(db);
            const chunk = updatedDocs.slice(i, i + batchLimit);

            chunk.forEach(({ id, users }) => {
                const ref = doc(db, 'userlist', id);
                batch.update(ref, { users });
            });

            // Add winner archive in the first batch only
            if (i === 0) {
                batch.set(winnersRef, winnersData);
            }

            await batch.commit();
        }


        return {
            success: true,
            message: 'Leaderboard and winners archive completed successfully.',
            updatedDocs: updatedDocs.length,
            top10SavedAs: monthYear,
        };
    } catch (error) {
        console.error('Monthly leaderboard archival failed:', error);
        return {
            success: false,
            message: 'Something went wrong during leaderboard archival.',
            error: error.message,
        };
    }
}

export function getPioneers() {
  const pioneers = [
    {
      id: "user_2zF9UnxCDI9zUJCX9FyoKyCMBSn",
      email: "oladojaabdquadridamilola@gmail.com",
      username: "dojah5090",
      fullname: "Oladoja Abd'Quadri Damilola"
    },
    {
      id: "user_2zFJWlfActg7s3nx1nYy0LR8uCR",
      email: "kwivaonline@gmail.com",
      username: "dojah5091",
      fullname: "Oladoja Dami"
    },
    {
      id: "user_2zFWX4TwSSEE2dIgNj6nZCWOsEf",
      email: "dmayorfitnesshub@gmail.com",
      username: "dojah5092",
      fullname: "Dojah Aremu"
    },
    {
      id: "user_2zKP7BcTkQDqqmoBVckOfAf64J7",
      email: "adedojakoredemubarak@gmail.com",
      username: "mickey20",
      fullname: "Adedoja Korede"
    },
    {
      id: "user_2zS9T0Bq1dNfSYlWbvmf55FIVWx",
      email: "adelekemohammed32@gmail.com",
      username: "mohad",
      fullname: "Adeleke Mohammed"
    },
    {
      id: "user_2zSGI91J4PHkN1KyrBlw122vaP2",
      email: "barakatbamise@gmail.com",
      username: "barakatb",
      fullname: "Barakat  Rahman"
    },
    {
      id: "user_2zSIIh0uxhujJB0YjHcPCh4NOSa",
      email: "odegsdipo456@gmail.com",
      username: "odega-tosin",
      fullname: "Oluwatosin Odega"
    },
    {
      id: "user_2zSIPuqPwyN91rrcy7OFi6kd3Uh",
      email: "oladojaabdqaudri@gmail.com",
      username: "dojah5094",
      fullname: "Akinkunmi Alade"
    },
    {
      id: "user_2zSIQ405qtILkmvXtxqpZsZgyJK",
      email: "alakaabdrahmanakinlabi@gmail.com",
      username: "akinlabi",
      fullname: "Abd-Rahman Alaka"
    },
    {
      id: "user_2zSg9ECUK99OLiDxSD5hQbC8Ue9",
      email: "oladokunmariamdgreat@gmail.com",
      username: "edith_clarke",
      fullname: "Mariam Oladokun"
    },
    {
      id: "user_2zTNR1dgHgriLlJ5dtjr7gWOy4Q",
      email: "olukunlesimonzay@gmail.com",
      username: "olukunlesimon",
      fullname: "Olukunle Adenekan"
    },
    {
      id: "user_2zUBPsUlFZQF1SqiVkMNIRbdxEn",
      email: "ogboo112@gmail.com",
      username: "mirage",
      fullname: "Olawale Owolabi"
    },
    {
      id: "user_2zV5yqUec2AVYZTkUSNVUi5pyeI",
      email: "salammuizademola@gmail.com",
      username: "muizkwiva",
      fullname: "Muiz  Ademola"
    },
    {
      id: "user_2zVNbLyloNkR5rlcjKGKezmMskX",
      email: "babalolabowale01@gmail.com",
      username: "esimuda",
      fullname: "Babalola Olabowale"
    },
    {
      id: "user_2zVUgiZvvxrVuTeEjZWZtZtW6ib",
      email: "oyedokuniyanuoluwaolubunmi@gmail.com",
      username: "auntybunmi",
      fullname: "Iyanuoluwa  Oyedokun"
    },
    {
      id: "user_2zVz6Dk4CW2cPASQWZ10bDaTRdi",
      email: "ibrahimrahmon94@gmail.com",
      username: "brahminbaay",
      fullname: "Rahmon  Ibrahim Opeyemi"
    },
    {
      id: "user_2zW1QUFPA7gPKFCzRfMolFZ6PF9",
      email: "meromarley20@gmail.com",
      username: "buck2wenti",
      fullname: "Abdullah Olatunji"
    },
    {
      id: "user_2zZ9w358IEbVyMVtStGE8ulp01r",
      email: "adelekandamilare03@gmail.com",
      username: "darebolt",
      fullname: "Damilare Adelekan"
    },
    {
      id: "user_2zbNiMfZbSHNJimKQR0jLSr5Wrw",
      email: "lasudeji14@gmail.com",
      username: "starryg",
      fullname: "Muhammad-ul-Awwal Adedeji"
    },
    {
      id: "user_2zco4qzxceUyIeTWuY75LMAaHxF",
      email: "oladelebarakat01@gmail.com",
      username: "damdam",
      fullname: "Barakat  Oladele"
    },
    {
      id: "user_2zcwwq70u9rR2tL7YC2XRtsRHqC",
      email: "daresalaudeen4@gmail.com",
      username: "darwin",
      fullname: "Dare A’Razaq"
    },
    {
      id: "user_2zvk8vraJxIfUV1ZafV5bQP4dA9",
      email: "bamideleadekunle57@gmail.com",
      username: "fortunate",
      fullname: "Adekunle  Bamidele"
    },
    {
      id: "user_2zzjTJ2OfUhE05nvNizAXlKTNy2",
      email: "lizzythom36@gmail.com",
      username: "bigveli",
      fullname: "Mubarak  Salam"
    },
    {
      id: "user_305KH2kMvsWFj3HaNvfiiyxiPk3",
      email: "oluwaremiadesina@gmail.com",
      username: "rhemite",
      fullname: "Adeshina Oluwaremi"
    },
    {
      id: "user_30CNXLyHVecMw6RK9mHBN7rWmue",
      email: "moyosoreadekunle119@gmail.com",
      username: "moyo",
      fullname: "Yusuff Moyosore"
    },
    {
      id: "user_30F1csQ129kT9PnIWWiogHNaV7b",
      email: "marvelousojomo2017@gmail.com",
      username: "mharvie_designs",
      fullname: "Marvelous Ojomo"
    },
    {
      id: "user_30P68LKg24v9TNibQxUVWsSBKT6",
      email: "abdulazeeziklimat@gmail.com",
      username: "nikkiesstitches05",
      fullname: "Abdulazeez Iklimat"
    },
    {
      id: "user_30T31bExnnegZQAraYD2hCdzPxg",
      email: "abdulrasaqhikmah774@gmail.com",
      username: "hikmah",
      fullname: "Hikmah Abdulrasaq"
    },
    {
      id: "user_30mw5PEG1MmX7W6QdhfSJo8r5av",
      email: "arigbabuwoabdulhamid2@gmail.com",
      username: "haymex",
      fullname: "Arigbabuwo  Odunayo"
    },
    {
      id: "user_30q1zjNSyqBo4vusObhsW0XZXI6",
      email: "ayomideolagunju180@gmail.com",
      username: "olamide",
      fullname: "Olagunju  Ayomide"
    },
    {
      id: "user_30ucED5LWoWFB8omOALHvWBFzQH",
      email: "ejirojeremiah123@gmail.com",
      username: "ejiroovba",
      fullname: "EJIRO OVBA"
    },
    {
      id: "user_30v7HmxdORM5zJ5bTDqpkKBlNZN",
      email: "olawalebadmus694@gmail.com",
      username: "olawalebadmus",
      fullname: "Waliyullah  Badmus"
    },
    {
      id: "user_30vtcOT3BoQXvsmaWs6PSc09Lak",
      email: "warisshittu24@gmail.com",
      username: "warisshittu",
      fullname: "Shittu Waris"
    },
    {
      id: "user_30yWLyoiIFVhgD0p6cUQSTI11zi",
      email: "mickyjnr2@gmail.com",
      username: "micky001",
      fullname: "Micky  Jnr"
    },
    {
      id: "user_30zybSgcQAdTfbOkGtkVzQtAan8",
      email: "oladojarahmat99@gmail.com",
      username: "ramzabal",
      fullname: "Oladoja Rahmat"
    },
    {
      id: "user_313bkh0LSpjrl5VkiYMXUF5Hv9y",
      email: "oladojabaliqisoladotun@gmail.com",
      username: "oladojabalqees",
      fullname: "Oladoja Balqis"
    },
    {
      id: "user_313f5xDdWC57PQ5iHXyoo1ZlO4x",
      email: "oladojamariam602@gmail.com",
      username: "emjay",
      fullname: "Oladoja  Mariam"
    },
    {
      id: "user_313jxcdHXZBjyFBEnhANEiNC6Cb",
      email: "babatolakehinde07@gmail.com",
      username: "kennybab07",
      fullname: "Babatola Kehindeenoch"
    },
    {
      id: "user_313krS6aV6mCEK26UiOqQOw2tJE",
      email: "ayomidesyomide986@gmail.com",
      username: "muller",
      fullname: "AYOMIDE ABAYOMI"
    },
    {
      id: "user_313kzsni5k8IcLcCTvMEMWbre6t",
      email: "ayishatabdulrosheed@gmail.com",
      username: "ayishatabdulrosheed",
      fullname: "Ayishat Abdulrosheed"
    },
    {
      id: "user_313vKLkoa6Bercs5rwaZ76iCiwU",
      email: "kimsolaowolabi12@gmail.com",
      username: "rita",
      fullname: "Owolabi  Oluwakemisola"
    },
    {
      id: "user_31CWBDlbnVClIS0mrQ1kPjxvXlO",
      email: "kolademary029@gmail.com",
      username: "mary",
      fullname: "Mary Kolade"
    },
    {
      id: "user_31CYapuDQvGIcdYp89aWVVaTEYv",
      email: "samuelchristianaolamide@gmail.com",
      username: "tiana",
      fullname: "Christiana  Samuel"
    },
    {
      id: "user_31Dy1067SrKWIku63oGfPIVbQNb",
      email: "abdulsalamakinyoola@gmail.com",
      username: "silent_architect",
      fullname: "Abdulsalam Akinyoola"
    },
    {
      id: "user_31DzURTrmkUePakzNGO1GoXksv8",
      email: "mayowaoyelowo1@gmail.com",
      username: "an-nutkiy",
      fullname: "Abdulwaheed  Mayowa  Oyelowo"
    },
    {
      id: "user_31IjWqrvDZ3Qkmcvngl5jw6PDCF",
      email: "olagokeolamide988@gmail.com",
      username: "lamique",
      fullname: "Olagoke Olamide"
    }
  ]

  return pioneers;
}
