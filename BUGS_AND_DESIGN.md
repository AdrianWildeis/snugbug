# Snugbug - Bugs & Design Review

## 🐛 **Current Bugs**

### Critical (Breaks functionality)

1. **Profile Page 500 Error**
   - **Location**: `src/app/[locale]/profile/page.tsx:13`
   - **Error**: `useTranslations` is not callable within an async component
   - **Fix**: Change `useTranslations` to `getTranslations`
   - **Status**: ❌ TO FIX

2. **Decimal Serialization Warning**
   - **Error**: "Only plain objects can be passed to Client Components from Server Components. Decimal objects are not supported."
   - **Impact**: Potential hydration mismatches when passing listing data
   - **Fix**: Convert `listing.price` from Decimal to number before passing to client
   - **Status**: ❌ TO FIX

3. **Translation Cache Issue**
   - **Error**: `MISSING_MESSAGE: Could not resolve listing.reviews in messages for locale fr`
   - **Fix**: Translation added but needs dev server restart
   - **Status**: ✅ FIXED (needs restart)

### Minor (Affects UX)

4. **Sign-in Page 404**
   - **Error**: `/fr/auth/signin` returns 404
   - **Expected**: Should show sign-in page
   - **Status**: ❌ TO INVESTIGATE

5. **Sell Page 404**
   - **Error**: `/sell` returns 404 (missing locale)
   - **Fix**: Should redirect to `/[locale]/sell`
   - **Status**: ⚠️ WORKS WITH LOCALE

---

## 🎨 **Design & UX Issues**

### Layout & Consistency

1. **Inconsistent Page Padding**
   - Some pages use `px-4 sm:px-6 lg:px-8`
   - Others use `px-4`
   - **Recommendation**: Standardize container padding

2. **Card Shadows Inconsistent**
   - Some use `shadow-sm`
   - Others use `shadow-md`
   - **Recommendation**: Create standard card component

3. **Button Styles Vary**
   - Primary buttons: sometimes `bg-blue-600`, sometimes `bg-green-600`
   - **Recommendation**: Define button variants (primary, secondary, danger)

### Empty States

4. **No Search Results Message**
   - When search returns 0 results, shows empty grid
   - **Recommendation**: Add "No listings found" with clear filters button

5. **Empty Profile Sections**
   - "0 listings" and "0 reviews" look bare
   - **Recommendation**: Add encouraging empty state messages

### Loading States

6. **Missing Loading Indicators**
   - Page transitions show nothing while loading
   - **Recommendation**: Add skeleton loaders

7. **Form Submission Feedback**
   - Loading state on buttons could be more visual
   - **Recommendation**: Add spinner icons to loading buttons

### Mobile Experience

8. **Search Filters on Mobile**
   - Filter panel takes full width, hard to use
   - **Recommendation**: Make filters collapsible/drawer on mobile

9. **Image Grid Too Dense**
   - 4-column grid on listing form cramped on mobile
   - **Recommendation**: Responsive grid (1 col mobile, 4 col desktop)

10. **Navigation Issues**
    - Header links might wrap on small screens
    - **Recommendation**: Test and add hamburger menu if needed

---

## 🎯 **Recommended Design System**

### Colors

```
Primary: Blue #2563EB (blue-600)
Success: Green #16A34A (green-600)
Danger: Red #DC2626 (red-600)
Warning: Yellow #EAB308 (yellow-500)

Background: Gray #F9FAFB (gray-50)
Card: White #FFFFFF
Border: Gray #E5E7EB (gray-200)
```

### Typography

```
Headings: font-bold
Body: font-normal
Small: text-sm
Tiny: text-xs

H1: text-3xl font-bold
H2: text-2xl font-semibold
H3: text-xl font-semibold
```

### Spacing

```
Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
Section: py-8
Card: p-6 rounded-lg
Button: px-6 py-3
```

### Components to Create

1. **Button Component**
   ```tsx
   variant: 'primary' | 'secondary' | 'danger'
   size: 'sm' | 'md' | 'lg'
   loading: boolean
   ```

2. **Card Component**
   ```tsx
   Shadow: shadow-sm
   Border: border border-gray-200
   Padding: p-6
   Radius: rounded-lg
   ```

3. **Empty State Component**
   ```tsx
   icon, title, description, action button
   ```

4. **Loading Skeleton**
   ```tsx
   For cards, lists, images
   ```

---

## ✅ **Priority Fix List**

### Must Fix Before Launch

1. ✅ Fix profile page `useTranslations` error
2. ✅ Fix Decimal serialization in listing cards
3. ⚠️ Restart dev server to clear translation cache
4. ✅ Add empty state for no search results
5. ✅ Test and fix mobile responsiveness

### Should Fix Soon

6. Create reusable Button component
7. Create reusable Card component
8. Add loading skeletons
9. Standardize spacing/padding
10. Add empty states for profile sections

### Nice to Have

11. Hamburger menu for mobile
12. Image upload progress indicators
13. Toast notifications for actions
14. Keyboard navigation improvements
15. Dark mode support

---

## 🧪 **Testing Checklist**

### Functionality
- [ ] Create listing
- [ ] Edit listing
- [ ] Delete listing
- [ ] Search listings
- [ ] Filter by category
- [ ] Filter by price
- [ ] Filter by location
- [ ] View listing details
- [ ] Sign in/out
- [ ] Edit profile

### Responsive Design
- [ ] Mobile (375px)
- [ ] Tablet (768px)
- [ ] Desktop (1024px+)

### Browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Mobile Safari
- [ ] Mobile Chrome

### Localization
- [ ] All pages work in EN
- [ ] All pages work in FR
- [ ] Translations complete
- [ ] Date/currency formatting

---

## 📋 **Next Steps**

1. **Fix Critical Bugs** (30 min)
   - Profile page error
   - Decimal serialization
   - Restart server

2. **Design Audit** (1 hour)
   - Screenshot all pages
   - Note inconsistencies
   - Create component library

3. **Implement Fixes** (2-3 hours)
   - Button component
   - Card component
   - Empty states
   - Loading states

4. **Mobile Testing** (1 hour)
   - Test all flows on mobile
   - Fix responsive issues
   - Optimize touch targets

5. **Final Polish** (1 hour)
   - Consistent spacing
   - Smooth transitions
   - Error handling
   - User feedback

**Total Estimated Time**: 5-6 hours to polish before moving to messaging/payments
