﻿using System;
using Csla;
using System.Collections.Generic;
using System.Linq;

namespace MobileKidsIdApp.Models
{
    [Serializable]
    public class CareProviderList : BusinessListBase<CareProviderList, CareProvider>
    {
        protected override CareProvider AddNewCore()
        {
            var nextId = 0;
            var maxId = this.OrderByDescending(fr => fr.Id).FirstOrDefault();
            if (maxId != null)
                nextId = maxId.Id + 1;

            var result = new CareProvider { Id = nextId };
            Add(result);
            return result;
        }

        private void Child_Fetch(List<DataAccess.DataModels.CareProvider> list)
        {
            foreach (var item in list)
                Add(DataPortal.FetchChild<CareProvider>(item));
        }
    }
}