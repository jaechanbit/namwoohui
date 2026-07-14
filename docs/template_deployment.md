# 🚀 [템플릿 5] 빌드 트러블슈팅 및 GitHub Pages 배포 가이드

Vite 컴파일 및 gh-pages를 사용하여 웹사이트를 정적으로 무료 배포할 때 발생하는 빌드 락(Build Lock) 해결법과 파워쉘 릴리즈 명령어 가이드입니다.

---

## ⚠️ 1. Vite 빌드 락(Exit Code 1) 현상 해결 방법
로컬 개발 서버(`npm run dev`)가 가동 중이거나, `dist` 폴더 내부의 정적 캐시가 프로세스에 물려 있을 때 `predeploy` 단계(`npm run build`)가 파일 액세스 거부로 실패하는 고질적 오류입니다.

### 💡 해결법 (수동 폴더 강제 잠금 해제)
`package.json` 에 걸려 있는 `predeploy` 스크립트에 의존하지 않고, 파워쉘 명령어를 활용해 **`dist` 캐시 폴더를 강제 삭제**하고 직접 번들러 컴파일을 유도한 뒤 gh-pages에 밀어 넣는 방식으로 락을 안전하게 우회합니다.

---

## ⚡ 2. 실전 통합 배포 파워쉘 스크립트
작업 완료 후 GitHub 원격 소스코드 저장소에 동기화하고, 동시에 사이트에 배포를 실시간으로 전송할 때 사용하는 통합 스크립트입니다. 

Windows PowerShell 콘솔을 열고 프로젝트 루트 경로에서 아래의 명령어를 순서대로 그대로 복사하여 실행합니다.

```powershell
# 1단계: Typescript 컴파일 에러가 없는지 정적 검사
npx tsc --noEmit

# 2단계: 프로세스에 물린 빌드 dist 폴더 강제 삭제 (Vite 빌드 락 우회)
Remove-Item -Recurse -Force dist

# 3단계: 프로덕션 릴리즈용 정적 리소스 컴파일 빌드
npx vite build

# 4단계: 깃허브 코드 변경 사항 전체 등록 및 커밋
git add .
git commit -m "Deploy latest updates to live pages and sync codebase"

# 5단계: 원격 깃허브 저장소(main 브랜치)로 소스 푸시
git push origin main

# 6단계: 빌드된 dist 폴더를 gh-pages 브랜치에 배포하여 웹사이트 실시간 전송
npx gh-pages -d dist
```

---

## 📁 3. `package.json` 배포 자동화 세팅 명세
`package.json` 파일의 `scripts` 영역 및 깃허브 경로 설정을 아래와 같이 맞춰두어야 위 명령어들이 정상 동작합니다.

```json
{
  "name": "temp-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "homepage": "https://<Jaechan-Github-ID>.github.io/<repository-name>/",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```
* **주의**: `homepage` 경로 마지막에 슬래시(`/`)를 빠뜨리지 않고 명확히 기재해야, CSS 및 이미지 에셋들의 정적 참조 경로가 깨지지 않고 깔끔하게 배포됩니다.
